import { Router } from "express";
import { getHealth } from "../controllers/handlers/get-handler";

const router: Router = Router();

router.route("/health").get(getHealth);

export default router;
