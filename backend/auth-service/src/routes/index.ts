import { Router } from "express";
import { getHealth } from "../controllers/handlers/get-handler";
import { logIn } from "../controllers/handlers/post-handler";

const router: Router = Router();

router.route("/health").get(getHealth);
router.route("/auth/login").post(logIn);

export default router;
