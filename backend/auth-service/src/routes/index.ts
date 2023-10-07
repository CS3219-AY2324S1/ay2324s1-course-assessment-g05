import { Router } from "express";
import { getHealth } from "../controllers/handlers/get-handler";
import {
  logInByEmail,
  registerByEmail,
  logOut,
} from "../controllers/handlers/post-handler";
import { verifyUserEmail, sendPasswordResetEmail, changePassword} from "../controllers/handlers/put-handler"
import passport from "passport";

const router: Router = Router();

router.route("/auth/health").get(getHealth);
router.route("/auth/registerByEmail").post(registerByEmail);
router.route("/auth/loginByEmail").post(logInByEmail);
router
  .route("/auth/validate")
  .post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
    res.status(200).json(req.user);
  });
router.route("/auth/logout").post(logOut);
router.route("/auth/verifyEmail/:email/:token").put(verifyUserEmail)
router.route("/auth/sendPasswordResetEmail/:email").put(sendPasswordResetEmail)
router.route("/auth/changePassword/:id").put(changePassword)

export default router;
