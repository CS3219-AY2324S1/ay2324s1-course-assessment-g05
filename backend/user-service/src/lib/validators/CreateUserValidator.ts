import z from "zod";
import { convertStringToRole } from "../enums/Role";

export const CreateUserValidator = z.object({
  name: z.string().min(5).max(255),
  email: z.string().email().max(255),
  role: z.string().transform(convertStringToRole),
  image: z.string().url().optional(),
});

export type CreateUserValidatorType = z.infer<typeof CreateUserValidator>;
