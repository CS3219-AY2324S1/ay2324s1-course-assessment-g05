import express, { Request, Response } from "express";
import {
  deleteQuestion,
  getHealth,
  getQuestionById,
  getQuestions,
  postQuestion,
  updateQuestion,
} from "../controllers";

const router = express.Router();

// check API health
router.route("/health").get(getHealth);

// Get all questions
router.route("/questions").get(getQuestions);

// Get a specific question
router.route("/questions/:questionId").get(getQuestionById);

// Post a new question
router.route("/questions").post(postQuestion);

// Update a question
router.route("/questions/:questionId").put(updateQuestion);

// Delete a question
router.route("/questions/:questionId").delete(deleteQuestion);

export default router;
