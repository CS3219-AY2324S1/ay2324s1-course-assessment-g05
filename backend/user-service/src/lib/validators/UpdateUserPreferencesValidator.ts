import { z } from "zod";
import { convertStringToComplexity } from "../enums/Complexity";
import { convertStringToLanguage } from "../enums/Language";
import { convertStringToTopic } from "../enums/Topic";

export const UpdateUserPreferencesValidator = z.object({
  languages: z.array(z.string().transform(convertStringToLanguage)).optional(),
  difficulties: z
    .array(z.string().transform(convertStringToComplexity))
    .optional(),
  topics: z.array(z.string().transform(convertStringToTopic)).optional(),
});

export type UpdateUserPreferencesBody = z.infer<
  typeof UpdateUserPreferencesValidator
>;
