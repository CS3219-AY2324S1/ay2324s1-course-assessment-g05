import z from "zod";
import { convertStringToTopic } from "../enums/Topic";
import { convertStringToComplexity } from "../enums/Complexity";

export const CreateQuestionValidator = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  topics: z.array(z.string().transform(convertStringToTopic)), // enum
  complexity: z.string().transform(convertStringToComplexity), // enum
  url: z.string().url(),
  author: z.string().min(5).max(50).optional(),
  // examples can be optional, but if it exists, it must have at least one example
  examples: z
    .array(
      z.object({
        input: z.string().min(3).max(1000),
        output: z.string().min(3).max(1000),
        explanation: z.string().min(3).max(1000).optional(),
      })
    )
    .refine((arr) => arr === undefined || arr.length > 0, {
      message: "At least one example is required.",
    })
    .optional(),
  // constraints can be optional, but if it exists, it must have at least one constraint
  constraints: z
    .array(z.string())
    .refine((arr) => arr === undefined || arr.length > 0, {
      message: "At least one example is required.",
    })
    .optional(),
});

export type CreateQuestionRequestBody = z.infer<typeof CreateQuestionValidator>;
