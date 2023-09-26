import z from "zod";
import { convertStringToRole } from "../enums/Role";
import { convertStringToGender } from "../enums/Gender";

export const CreateUserValidator = z.object({
  name: z.string().min(5).max(100),
  email: z.string().email().max(100),
  password: z.string(),
  role: z.string().transform(convertStringToRole),

  image: z.string().url().optional(),
  bio: z.string().min(3).max(255).optional(),
  gender: z.string().transform(convertStringToGender).optional(),
});

export type CreateUserValidatorType = z.infer<typeof CreateUserValidator>;
