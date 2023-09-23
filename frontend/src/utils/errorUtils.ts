import { getLogger } from "@/helpers/logger";

const logger = getLogger("api");

export function throwAndLogError<T extends Error>(
  endpoint: string,
  message: string,
  type: new (message: string) => T
): never {
  logger.error(`[${endpoint}] ${message}`);
  throw new type(message);
}
