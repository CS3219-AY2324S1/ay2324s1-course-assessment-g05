import { z } from "zod";

export const CodeSubmissionBodyValidator = z.object({
  code: z.string().max(10000),
});

export type CodeSubmissionBody = z.infer<typeof CodeSubmissionBodyValidator>;
