import { Router } from "express";
import { getHealth } from "../controllers/handlers/get-handler";
import {
  logInByEmail,
  registerByEmail,
} from "../controllers/handlers/post-handler";
import passport from "passport";

const router: Router = Router();

router.route("/auth/health").get(getHealth);
router.route("/auth/registerByEmail").post(registerByEmail);
router.route("/auth/loginByEmail").post(logInByEmail);
router
  .route("/auth/validate")
  .post(passport.authenticate("jwt", { session: false }), (req, res, next) => {
    res.status(200).json({ data: req.user });
  });

//consider handling register to issue jwt

export default router;
