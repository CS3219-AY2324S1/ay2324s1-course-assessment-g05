type History = {
  userId: string;
  questionId: string;
  title: string;
  topics: string[];
  complexity: string;
  language: string;
  createdAt: string;
  updatedAt: string;
};

export type DataItem = {
  name: string;
  value: number;
};

export default History;
