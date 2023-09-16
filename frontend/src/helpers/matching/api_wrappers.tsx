/* -------------------------------------------------------------------------- */
/*                      mock backend for matching service                     */
/* -------------------------------------------------------------------------- */

//TODO: change preferences to be a type
const submitMatchPreferences = (preferences: {}) => {
  console.log(`Submitted for matching: ${JSON.stringify(preferences)}`);
};

export const MatchingService = { submitMatchPreferences };
