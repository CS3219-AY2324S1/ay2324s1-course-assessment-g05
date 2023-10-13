import z from "zod";
import { isCuid } from "../utils/stringUtils";
import { convertStringToComplexity } from "../enums/Complexity";
import { convertStringToLanguage } from "../enums/Language";
import { convertStringToTopic } from "../enums/Topic";

export const CreateHistoryBodyValidator = z.object({
  userId: z.union([
    z
      .array(z.string().refine((id) => isCuid(id), "Invalid user id"))
      .length(2)
      .refine((ids) => new Set(ids).size === 2, "Duplicate user ids"),
    z.string().refine((id) => isCuid(id), "Invalid user id"),
  ]),
  questionId: z.string().refine((id) => isCuid(id), "Invalid question id"),
  title: z.string().min(3).max(100),
  topics: z
    .array(z.string().transform(convertStringToTopic))
    .refine((topics) => topics.length > 0, "At least one topic is required")
    .refine(
      (topics) => new Set(topics).size === topics.length,
      "Each topic must be unique"
    ),
  complexity: z.string().transform(convertStringToComplexity),
  language: z.string().transform(convertStringToLanguage),
});

export type CreateHistoryBody = z.infer<typeof CreateHistoryBodyValidator>;
