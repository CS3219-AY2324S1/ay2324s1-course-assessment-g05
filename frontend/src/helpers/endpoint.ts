"use server";
import { HTTP_METHODS, SERVICE } from "@/types/enums";
import { getLogger } from "./logger";
import { revalidateTag } from "next/cache";

const logger = getLogger("api");

/**
 * Configuration object for API calls.
 */
type ApiConfig = {
  method: HTTP_METHODS; // HTTP method.
  service: SERVICE; // Enum representing the service type.
  path?: string; // Optional endpoint path.
  body?: {}; // Optional request body.
  tags?: string[]; // Optional array of caching scopes.
};

/**
 * Response object for API calls.
 */
type ApiResponse = {
  status: number; // HTTP status code.
  message: string;
  data?: any; // Response data.
};

/**
 * Handles API calls to the backend gateway.
 * @param config {ApiConfig} - Configuration object for the API call.
 * @returns {Promise<ApiResponse>} - Response from the API call.
 */
export default async function api(config: ApiConfig): Promise<ApiResponse> {
  // Configure gateway host based on the environment (production or development).
  const host =
    process.env.NODE_ENV == "production"
      ? process.env.ENDPOINT_PROD
      : process.env.ENDPOINT_DEV;

  // Configure local service port based on the 'service' property in the configuration.
  let servicePort = ":";
  switch (config.service) {
    case SERVICE.QUESTION:
      servicePort += process.env.ENDPOINT_QUESTION_PORT || "";
      break;
    case SERVICE.USER:
      servicePort += process.env.ENDPOINT_USER_PORT || "";
    default:
      servicePort = "";
      break;
  }

  // Build the final API endpoint URL.
  const endpoint = `http://${host}${servicePort}/api/${config.service}/${
    config.path || ""
  }`;
  logger.info(`[endpoint::api] ${config.method}: ${endpoint}`);

  // Log the request body if it exists.
  if (config.body) {
    logger.debug(`[endpoint::api] ${JSON.stringify(config.body)}`);
  }

  try {
    // Fetch data from the constructed API endpoint.
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

    // Parse the response body for all status codes except 204 (no content).
    let data = res.status != 204 ? await res.json() : {};

    logger.info(`[${res.status}] ${config.method}: ${res.url}}`);

    // Return an ApiResponse object with status, data, and message.
    return {
      status: res.status,
      message: res.statusText,
      data: data,
    };
  } catch (error) {
    // Handle errors and log them.
    logger.error(`[endpoint::api] ${error}`);

    // Return an ApiResponse with a 500 status code and an error message.
    return {
      status: 500,
      message: `Internal Error.`,
    };
  }
}
