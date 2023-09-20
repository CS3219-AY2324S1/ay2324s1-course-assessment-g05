import Complexity from "../../../lib/enums/Complexity";
import Topic from "../../../lib/enums/Topic";
import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  topics: [
    {
      type: String,
      required: true,
      enum: Object.values(Topic),
    },
  ],
  complexity: {
    type: String,
    required: true,
    enum: Object.values(Complexity),
  },
  url: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: false,
    default: "LeetCode",
  },
  examples: [
    {
      input: {
        type: String,
        required: true,
      },
      output: {
        type: String,
        required: true,
      },
      explanation: {
        type: String,
        required: false,
      },
    },
  ],
  constraints: [
    {
      type: String,
      required: false,
    },
  ],
  createdOn: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    required: false,
  },
});

const questionDb = mongoose.model("Question", QuestionSchema);

export default questionDb;
