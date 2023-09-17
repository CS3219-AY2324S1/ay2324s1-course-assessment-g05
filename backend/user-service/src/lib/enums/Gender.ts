import { ZodError, ZodIssue, ZodIssueCode } from "zod";

enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export const convertStringToGender = (gender: string) => {
  switch (gender.toUpperCase()) {
    case "male":
      return Gender.MALE;
    case "female":
      return Gender.FEMALE;
    case "other":
      return Gender.OTHER;
    default:
      throw new ZodError([{ message: "Invalid gender" } as ZodIssue]);
  }
};

export default Gender;
