"use server"
import { SERVICE } from "@/types/enums";
import { getSocketConfig } from "../endpoint";
import { getLogger } from "../logger";

const logger = getLogger("wrapper");

//TODO: change preferences to be a type
export async function submitMatchPreferences(preferences: {}) {
  console.log(`Submitted for matching: ${JSON.stringify(preferences)}`);
};

export async function getMatchingSocket() {
  return await getSocketConfig(SERVICE.MATCHING);
}

export async function getMatchedRecord(
  {
    firstUserId,
    secondUserId,
    questionId,
    matchedLanguage,
  }: {
    firstUserId: string;
    secondUserId: string;
    questionId: string;
    matchedLanguage: string;
  }
) {
  return {
    firstUserId: firstUserId,
    secondUserId: secondUserId,
    questionId: questionId,
    matchedLanguage: matchedLanguage,
  };
}
