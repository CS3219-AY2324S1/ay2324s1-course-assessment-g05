/* -------------------------------------------------------------------------- */
/*                      mock backend for history service                      */
/* -------------------------------------------------------------------------- */

const getNumQuestionsForEachComplexity = () => {
  const data = [
    { name: "Easy", value: 5 },
    { name: "Medium", value: 8 },
    { name: "Hard", value: 20 },
  ];
  return data;
};

export const HistoryService = {
  getNumQuestionsForEachComplexity,
};
