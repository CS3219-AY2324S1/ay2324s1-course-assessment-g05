/* -------------------------------------------------------------------------- */
/*                      mock backend for matching service                     */
/* -------------------------------------------------------------------------- */
"use server"
import { HTTP_METHODS, SERVICE } from "@/types/enums";
import endpoint, { getSocket, getSocketConfig } from "../endpoint";
import { io } from "socket.io-client";
import api from "../endpoint";
import { getLogger } from "../logger";

const logger = getLogger("wrapper");

//TODO: change preferences to be a type
export async function submitMatchPreferences (preferences: {}) {
  console.log(`Submitted for matching: ${JSON.stringify(preferences)}`);
};

export async function getMatchingSocket()  {
  return await getSocketConfig(SERVICE.MATCHING);
}

// export const MatchingService = { submitMatchPreferences };
