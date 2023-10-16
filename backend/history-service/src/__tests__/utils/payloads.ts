export function generateCUID() {
  const characters = "0123456789abcdefghijklmnopqrstuvwxyz";

  // Start with one of the characters from 'cdefghij'
  let cuid = "cln";

  // Generate the remaining 25 characters
  for (let i = 0; i < 22; i++) {
    cuid += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return cuid;
}

export const getHistoryPayload = ({
  userId,
  questionId,
}: {
  userId?: string;
  questionId?: string;
}) => {
  if (userId && questionId) {
    return [
      {
        userId: userId,
        questionId: questionId,
        title: "title",
        topics: ["ARRAY", "STRING"],
        complexity: "EASY",
        language: "C++",
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return [
    {
      userId: userId ? userId : generateCUID(),
      questionId: questionId ? questionId : generateCUID(),
      title: "title 1",
      topics: ["ARRAY", "STRING"],
      complexity: "EASY",
      language: "C++",
      createdAt: new Date().toISOString(),
    },
    {
      userId: userId ? userId : generateCUID(),
      questionId: questionId ? questionId : generateCUID(),
      title: "title 2",
      topics: ["TWO POINTERS", "SORTING"],
      complexity: "MEDIUM",
      language: "JAVA",
      createdAt: new Date().toISOString(),
    },
    {
      userId: userId ? userId : generateCUID(),
      questionId: questionId ? questionId : generateCUID(),
      title: "title 3",
      topics: ["BREADTH-FIRST SEARCH", "DEPTH-FIRST SEARCH", "GRAPH"],
      complexity: "HARD",
      language: "PYTHON",
      createdAt: new Date().toISOString(),
    },
  ];
};

export const getCreateHistoryBodyPayload = ({
  userId,
  questionId,
}: {
  userId?: string | string[];
  questionId?: string;
}) => {
  return {
    userId,
    questionId,
    title: "title",
    topics: ["ARRAY", "STRING"],
    complexity: "EASY",
    language: "C++",
  };
};

export const HistoryPayload = {
  getHistoryPayload,
  getCreateHistoryBodyPayload,
};
