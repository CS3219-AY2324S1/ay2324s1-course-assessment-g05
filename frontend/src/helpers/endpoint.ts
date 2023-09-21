"use server";
import { SERVICE } from "@/types/enums";
import { getLogger } from "./logger";
const logger = getLogger("api");

type ApiConfig = {
  method: string;
  service: SERVICE;
  path: string;
  body?: {};
  tags?: string[]; // cache scope
};

type ApiResponse = {
  status?: number;
  data?: any;
  message?: string;
  error?: string;
};

/**
 * Production: service_api_url/<path>
 * Development: localhost:<service_ports>/<path>
 * @param service
 * @param path
 */
export default async function api(
  config: ApiConfig,
  success?: (res: any) => void,
  error?: (err: any) => void,
): Promise<ApiResponse> {
  // Configure gateway host
  const host =
    process.env.NODE_ENV == "production"
      ? process.env.ENDPOINT_PROD
      : process.env.ENDPOINT_DEV;

  // Configure local service port
  let servicePort = ":";
  switch (config.service) {
    case SERVICE.QUESTION:
      servicePort += process.env.ENDPOINT_QUESTION_PORT || "";
      break;
    default:
      servicePort = "";
      break;
  }

  // Build final endpoint
  const endpoint = `http://${host}${servicePort}/api/${config.service}/${config.path}`;
  logger.info(`[endpoint::api]: ${config.method}: ${endpoint}`);
  if (config.body) {
    logger.debug(`[endpoint::api]: ${JSON.stringify(config.body)}`);
  }

  // Fetch endpoint
  try {
    const res = await fetch(endpoint, {
      method: config.method,
      headers: {
        ...(config.body ? { "Content-Type": "application/json" } : {}),
      },
      body: JSON.stringify(config.body),
      next: {
        tags: config.tags,
      },
    });

    let data = await res.json();
    logger.debug(`[${res.status}] ${config.method}: ${res.url}`);

    return {
      status: res.status,
      data: data,
      message: res.statusText,
    };
  } catch (error) {
    logger.error(`[endpoint::api] error: ${error}`);
    return {
      status: 500,
      message: `Internal Error.`,
    };
  }
}
