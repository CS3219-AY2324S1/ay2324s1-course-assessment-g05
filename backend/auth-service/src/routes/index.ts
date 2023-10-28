import { Router } from "express";
import { getHealth } from "../controllers/handlers/get-handler";
import {
  logInByEmail,
  registerByEmail,
  logOut,
} from "../controllers/handlers/post-handler";
import {
  verifyUserEmail,
  sendPasswordResetEmail,
  changePassword,
} from "../controllers/handlers/put-handler";
import passport from "passport";
import HttpStatusCode from "../common/HttpStatusCode";
import { UserProfile } from "../common/types";

const router: Router = Router();

router.route("/health").get(getHealth);

router.route("/registerByEmail").post(registerByEmail);

router.route("/loginByEmail").post(logInByEmail);

router
  .route("/validate")
  .post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
    // If user service is down, req.user will be an empty object
    if (req.user && Object.keys(req.user).length === 0) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: "INTERNAL SERVER ERROR",
        message: "User service is down.",
      });
      return;
    }

    const userToReturn = { ...req.user } as UserProfile;

    res.status(HttpStatusCode.OK).json({
      id: userToReturn.id,
      email: userToReturn.email,
      role: userToReturn.role,
      gender: userToReturn.gender,
      bio: userToReturn.bio,
      image: userToReturn.image,
      createdOn: userToReturn.createdOn,
      updatedOn: userToReturn.updatedOn,
      isVerified: userToReturn.isVerified,
    });
  });

router
  .route("/validateAdmin")
  .post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
    // If user service is down, req.user will be an empty object
    if (req.user && Object.keys(req.user).length === 0) {
      res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
        error: "INTERNAL SERVER ERROR",
        message: "User service is down.",
      });
      return;
    }

    const user = req.user as UserProfile;
    if (user.role !== "ADMIN") {
      res.status(HttpStatusCode.FORBIDDEN).json({
        error: "Forbidden",
        message: "You are not authorized to access this resource.",
      });
      return;
    }

    const userToReturn = { ...req.user } as UserProfile;

    res.status(HttpStatusCode.OK).json({
      id: userToReturn.id,
      email: userToReturn.email,
      role: userToReturn.role,
      gender: userToReturn.gender,
      bio: userToReturn.bio,
      image: userToReturn.image,
      createdOn: userToReturn.createdOn,
      updatedOn: userToReturn.updatedOn,
      isVerified: userToReturn.isVerified,
    });
  });

router.route("/logout").post(logOut);

router.route("/verifyEmail/:email/:token").put(verifyUserEmail);

router.route("/sendPasswordResetEmail/:email").put(sendPasswordResetEmail);

router.route("/changePassword/:id").put(changePassword);

export default router;
