/* -------------------------------------------------------------------------- */
/*                      mock backend for matching service                     */
/* -------------------------------------------------------------------------- */

//TODO: change preferences to be a type
const submitMatchPreferences = (preferences: {}) => {
  console.log(`Submitted for matching: ${JSON.stringify(preferences)}`);
};

// TODO: update this to an actual API call to matching service
const getMatchedRecord = ({
  firstUserId,
  secondUserId,
  questionId,
  matchedLanguage,
}: {
  firstUserId: string;
  secondUserId: string;
  questionId: string;
  matchedLanguage: string;
}) => {
  return {
    firstUserId: firstUserId,
    secondUserId: secondUserId,
    questionId: questionId,
    matchedLanguage: matchedLanguage,
  };
};

export const MatchingService = { submitMatchPreferences, getMatchedRecord };
