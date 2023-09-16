import pino, { Logger } from "pino";

/**
 * Defines default log level for scope (pages etc)
 */
const logLevelConfig = {
  "*": "info",
  api: "debug",
};

const logLevels = new Map<string, string>(Object.entries(logLevelConfig));

export function getLogLevel(logger: string): string {
  return logLevels.get(logger) || logLevels.get("*") || "info";
}

/**
 * Return a logger object
 * @param scope
 * @returns
 */
export function getLogger(scope: string): Logger {
  return pino({ scope, level: getLogLevel(scope) });
}
