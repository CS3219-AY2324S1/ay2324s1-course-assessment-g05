import { Status, Role } from "./enums"

type User = {
    id: str,
    name: str,
    email: str,
    role: Role, // (admin, user)

    image?: str,
    bio?: string,
    gender?: string,

    // password: str, 
    status: Status, // (active, inactive)
    createdOn: Date;
    updatedOn: Date;
    preferences?: string
}

export default User;