import { SERVICE } from "@/types/enums";
import { getLogger } from "./logger";
const logger = getLogger("api");

type apiConfig = {
  method: string;
  service: SERVICE;
  path: string;
  body?: {};
  tags?: string[]; // cache scope
};

/**
 * Production: service_api_url/<path>
 * Development: localhost:<service_ports>/<path>
 * @param service
 * @param path
 */
export const api = async (config: apiConfig) => {
  const host = process.env.NODE_ENV == 'production'? process.env.ENDPOINT_PROD : process.env.ENDPOINT_DEV;

  let servicePort = ":";
  switch (config.service) {
    case SERVICE.QUESTION:
      servicePort += process.env.ENDPOINT_QUESTION_PORT || "";
      break;
    default:
      servicePort = "";
      break;
  }

  const endpoint = `http://${host}${servicePort}/${config.path}`;

  logger.info(`${config.method}: [${endpoint}]`);
  if (config.body) {
    logger.info(`${config.body}`);
  }

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

    if (!res.ok) {
      return [];
    }

    return res.json();
  } catch (error) {
    logger.error(`${error}`);
    return [];
  }
};

export default api;
