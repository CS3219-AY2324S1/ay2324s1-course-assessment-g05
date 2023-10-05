import { Question } from "../../models/question";
import Topic from "../../lib/enums/Topic";
import Complexity from "../../lib/enums/Complexity";

export function getQuestionsPayload() {
  return [
    {
      id: "testquestionid123",
      title: "Test question title 1",
      topics: [Topic.ARRAY, Topic.BINARYSEARCH],
      complexity: Complexity.EASY,
    },
    {
      id: "testquestionid456",
      title: "Test question title 2",
      topics: [Topic.TOPOSORT, Topic.HASHTABLE],
      complexity: Complexity.MEDIUM,
    },
    {
      id: "testquestionid789",
      title: "Test question title 3",
      topics: [
        Topic.ARRAY,
        Topic.DP,
        Topic.BINARYSEARCH,
        Topic.GRAPH,
        Topic.HASHTABLE,
      ],
      complexity: Complexity.HARD,
    },
  ];
}

export function getQuestionPayload(questionId = "testquestionid123") {
  return {
    id: questionId,
    title: "Test question title",
    topics: [Topic.ARRAY, Topic.BINARYSEARCH],
    complexity: Complexity.EASY,
    description: "Test question description",
    url: "https://test-question.com/problems/test-question",
    examples: [
      {
        input: "test input",
        output: "test output",
        explanation: "test explanation",
      },
    ],
    constraints: ["test constraint"],
    author: "test author",
    createdOn: new Date().getTime(),
    updatedOn: new Date().getTime(),
  };
}

export function getCreateQuestionRequestBody() {
  return {
    title: "Test question title",
    topics: [Topic.ARRAY, Topic.BINARYSEARCH],
    complexity: Complexity.EASY,
    description: "Test question description",
    url: "https://test-question.com/problems/test-question",
    examples: [
      {
        input: "test input",
        output: "test output",
        explanation: "test explanation",
      },
    ],
    constraints: ["test constraint"],
    author: "Test Author",
  };
}
