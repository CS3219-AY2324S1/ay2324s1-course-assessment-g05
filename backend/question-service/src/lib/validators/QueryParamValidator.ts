import { z } from "zod";
import { convertStringToTopic } from "../enums/Topic";
import { convertStringToComplexity } from "../enums/Complexity";

export const QueryParamValidator = z.object({
  topics: z.union([
    z.array(z.string().transform(convertStringToTopic)).optional(),
    z.string().transform(convertStringToTopic).optional(),
  ]),
  complexity: z.string().transform(convertStringToComplexity).optional(),
  author: z.string().min(5).max(50).optional(),
});
