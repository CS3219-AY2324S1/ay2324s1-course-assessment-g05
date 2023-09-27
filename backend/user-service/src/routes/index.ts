import { Router } from "express";
import {
  deleteUserById,
  getHealth,
  getPreferencesByUserId,
  getUserByEmail,
  getUserById,
  postUser,
  updateUserById,
  updateUserPreferences,
  postImage,
  getImage
} from "../controllers";

const router: Router = Router();

router.route("/health").get(getHealth);

router.route("/users/email").get(getUserByEmail);

router.route("/users/:userId/image").post(postImage);

router.route("/users/:userId").get(getUserById);

router.route("/users/:userId/preferences").get(getPreferencesByUserId);

router.route("/users/:userId/preferences").put(updateUserPreferences);

router.route("/users").post(postUser);

router.route("/users/:userId").put(updateUserById);

router.route("/users/:userId").delete(deleteUserById);

router.route("/users/:userId/image/:fileName").get(getImage);

export default router;
