import { Status, Role } from "./enums"

type User = {
    id: str,
    image?: str,
    name: str,
    email: str,
    password: str, 
    role: Role, // (admin, user)
    status: Status, // (active, inactive)
    createdOn: Date;
}

export default User;