import z from "zod";
import { isCuid } from "../utils/stringUtils";

export const CreateHistoryBodyValidator = z.object({
  userId: z.union([
    z
      .array(z.string().refine((id) => isCuid(id), "Invalid user id"))
      .length(2)
      .refine((ids) => new Set(ids).size === 2, "Duplicate user ids"),
    z.string().refine((id) => isCuid(id), "Invalid user id"),
  ]),
  questionId: z.string().refine((id) => isCuid(id), "Invalid question id"),
});

export type CreateHistoryBody = z.infer<typeof CreateHistoryBodyValidator>;
