import Category from "../lib/enums/Category";
import Complexity from "../lib/enums/Complexity";

type Example = {
  input: string;
  output: string;
  explanation?: string;
};

type Question = {
  id: string;
  title: string;
  description: string;
  category: string[]; // enum
  complexity: Complexity; // enum
  url: string;
  // optional attributes
  examples?: Example[];
  constraints?: string[];
  createdOn?: number;
  updatedOn?: number;
  author?: string;
};
