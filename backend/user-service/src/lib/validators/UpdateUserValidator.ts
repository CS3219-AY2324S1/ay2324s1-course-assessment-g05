import z from "zod";
import { convertStringToRole } from "../enums/Role";
import { convertStringToGender } from "../enums/Gender";

export const UpdateUserValidator = z.object({
  name: z.string().min(5).max(255).optional(),
  email: z.string().email().optional(),
  role: z.string().transform(convertStringToRole).optional(),
  image: z.string().url().optional(),
  bio: z.string().max(255).optional(),
  gender: z.string().transform(convertStringToGender).optional(),
});

export type UpdateUserValidatorType = z.infer<typeof UpdateUserValidator>;
