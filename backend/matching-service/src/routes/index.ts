import { Router } from "express";
import {
  getHealth,
} from "../controllers";

const router: Router = Router();

router.route("/health").get(getHealth);

export default router;
