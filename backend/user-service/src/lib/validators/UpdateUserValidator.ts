import z from "zod";
import { convertStringToRole } from "../enums/Role";

export const UpdateUserValidator = z.object({
  name: z.string().min(5).max(255).optional(),
  email: z.string().email().optional(),
  role: z.string().transform(convertStringToRole).optional(),
  image: z.string().url().optional(),
});

export type UpdateUserValidatorType = z.infer<typeof UpdateUserValidator>;
