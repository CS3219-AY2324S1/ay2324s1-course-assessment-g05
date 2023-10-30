export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
}

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}

type Preference = {
  languages: string[];
  topics: string[];
  difficulties: string[];
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: Role; //enum
  image?: string;
  bio?: string;
  gender?: Gender;
  createdOn?: Date;
  updatedOn?: Date;
  preferences?: Preference;
  isVerified?: boolean;
  password?: string;
};

export type Source = {
  user: string;
  pass: string;
};

export type Email = {
  source: Source;
  recipient: string;
  subject: string;
  content: string;
};
