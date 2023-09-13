enum Gender {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other",
}

export const convertStringToGender = (gender: string) => {
  switch (gender.toLowerCase()) {
    case "male":
      return Gender.MALE;
    case "female":
      return Gender.FEMALE;
    case "other":
      return Gender.OTHER;
    default:
      throw new Error("Invalid gender");
  }
};

export default Gender;
