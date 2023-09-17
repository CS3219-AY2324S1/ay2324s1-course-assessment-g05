import { z } from "zod";
import { convertStringToLanguage } from "../enums/Language";
import { convertStringToComplexity } from "../enums/Complexity";
import { convertStringToTopic } from "../enums/Topic";

export const CreateUserPreferencesValidator = z.object({
  languages: z.array(z.string().transform(convertStringToLanguage)),
  difficulties: z.array(z.string().transform(convertStringToComplexity)),
  topics: z.array(z.string().transform(convertStringToTopic)),
});

export type CreateUserPreferencesBody = z.infer<
  typeof CreateUserPreferencesValidator
>;
