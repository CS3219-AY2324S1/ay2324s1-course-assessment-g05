import { Router } from "express";
import {
  deleteUserById,
  getHealth,
  getUserByEmail,
  getUserById,
  postUser,
  updateUserById,
} from "../controllers";

const router: Router = Router();

router.route("/health").get(getHealth);

router.route("/users/email").get(getUserByEmail);

router.route("/users/:userId").get(getUserById);

router.route("/users").post(postUser);

router.route("/users/:userId").put(updateUserById);

router.route("/users/:userId").delete(deleteUserById);

export default router;
