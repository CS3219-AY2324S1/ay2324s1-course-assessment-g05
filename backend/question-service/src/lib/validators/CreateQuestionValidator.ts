import z from "zod";

export const CreateQuestionValidator = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(3).max(1000),
  category: z.array(z.string()), // enum
  complexity: z.string(), // enum
  url: z.string().includes("https://leetcode.com/"),
  author: z.string().optional(),
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
  constraints: z
    .array(z.string())
    .refine((arr) => arr === undefined || arr.length > 0, {
      message: "At least one example is required.",
    })
    .optional(),
});

export type CreateQuestionRequestBody = z.infer<typeof CreateQuestionValidator>;
