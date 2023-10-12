export function generateCUID() {
  const characters =
    "cdefghijabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Start with one of the characters from 'cdefghij'
  let cuid = characters.charAt(Math.floor(Math.random() * 7));

  // Generate the remaining 25 characters
  for (let i = 0; i < 25; i++) {
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
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return [
    {
      userId: userId ? userId : generateCUID(),
      questionId: questionId ? questionId : generateCUID(),
      createdAt: new Date().toISOString(),
    },
    {
      userId: userId ? userId : generateCUID(),
      questionId: questionId ? questionId : generateCUID(),
      createdAt: new Date().toISOString(),
    },
    {
      userId: userId ? userId : generateCUID(),
      questionId: questionId ? questionId : generateCUID(),
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
  };
};

export const HistoryPayload = {
  getHistoryPayload,
  getCreateHistoryBodyPayload,
};
