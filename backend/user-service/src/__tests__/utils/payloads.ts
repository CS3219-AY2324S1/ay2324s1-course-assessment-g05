export const getUserPayload = ({
  userId,
  email,
}: {
  userId?: string;
  email?: string;
}) => {
  return {
    id: userId || "test-user-id",
    name: "Test Username",
    email: email || "testusername@email.com",
    role: "ADMIN",
    image: "https://testimage.com/image.png",
    bio: "Test bio",
    gender: "MALE",
    createdOn: new Date(),
    updatedOn: new Date(),
  };
};

export const getPostUserPayload = () => {
  return {
    name: "Test Username",
    email: "username@email.com",
    role: "USER",
    image: "https://testimage.com/image.png",
    bio: "Test bio",
    gender: "MALE",
  };
};
