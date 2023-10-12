import { Router } from "express";
import {
  deleteHistory,
  getHealth,
  getHistory,
  postHistory,
} from "../controllers";

const router: Router = Router();

router.route("/health").get(getHealth);

router.route("/history").get(getHistory);

router.route("/history").post(postHistory);

router
  .route("/history/user/:userId/question/:questionId")
  .delete(deleteHistory);

export default router;
