export type Example = {
  input: string;
  output: string;
  explanation: string;
};

type Question = {
  _id?: string;
  title: string;
  complexity: string;
  topics: string[];
  description: string;
  examples?: Example[];
  constraints?: string[];
  category?: string[];
  status?: string;
  createdOn?: string;
  updatedOn?: string;
  author?: string;
  url?: string;
};

export default Question;
