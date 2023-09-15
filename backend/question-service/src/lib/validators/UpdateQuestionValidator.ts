import z from "zod";

export const UpdateQuestionValidator = z.object({
  title: z.string().min(3).max(100).optional(),
  description: z.string().min(3).max(1000).optional(),
  category: z.array(z.string()).optional(), // enum
  complexity: z.string().optional(), // enum
  url: z.string().includes("https://leetcode.com/").optional(),
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

export type UpdateQuestionRequestBody = z.infer<typeof UpdateQuestionValidator>;
