import { z } from "zod";
import { convertStringToTopic } from "../enums/Topic";
import { convertStringToComplexity } from "../enums/Complexity";

export const QueryParamValidator = z.object({
  // if multiple topics are provided, group them into an array
  topics: z.union([
    z
      .array(z.string().transform(convertStringToTopic))
      .refine((topics) => topics.length > 0, "At least one topic is required.")
      .refine(
        (topics) => new Set(topics).size === topics.length,
        "Duplicated topics detected"
      )
      .optional(),
    z.string().transform(convertStringToTopic).optional(),
  ]),
  complexity: z.string().transform(convertStringToComplexity).optional(),
  author: z.string().min(5).max(50).optional(),
});
