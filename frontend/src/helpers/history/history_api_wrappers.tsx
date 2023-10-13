/* -------------------------------------------------------------------------- */
/*                      mock backend for history service                      */
/* -------------------------------------------------------------------------- */

import { HTTP_METHODS, SERVICE } from "@/types/enums";
import api from "../endpoint";
import { getLogger } from "../logger";
import HttpStatusCode from "@/types/HttpStatusCode";
import History from "@/types/history";
import { getError, throwAndLogError } from "@/utils/errorUtils";
import Question from "@/types/question";
import { getQuestionById } from "../question/question_api_wrappers";

const logger = getLogger("history_api_wrappers");

const historyService = SERVICE.HISTORY;

const getAttemptedQuestionIds = async (
  userId: string,
  cache: RequestCache = "no-cache"
) => {
  const queryParam = `?userId=${userId}`;

  const response = await api({
    method: HTTP_METHODS.GET,
    service: historyService,
    path: queryParam,
    cache: cache,
  });

  if (response.status === HttpStatusCode.OK) {
    const data = response.data as History[];

    const questionIds = data.map((history) => history.questionId);

    return questionIds;
  }

  return throwAndLogError(
    "getAttemptedQuestionIds",
    response.message,
    getError(response.status)
  );
};

const getNumberOfAttemptedQuestionsByComplexity = async (
  questionIds: string[]
) => {
  const data = [
    { name: "Easy", value: 0 },
    { name: "Medium", value: 0 },
    { name: "Hard", value: 0 },
  ];

  const promises = questionIds.map((questionId) => {
    return getQuestionById(questionId);
  });

  try {
    const questions = (await Promise.all(promises)) as Question[];

    questions.forEach((question) => {
      switch (question.complexity.toUpperCase()) {
        case "EASY":
          data[0].value++;
          break;
        case "MEDIUM":
          data[1].value++;
          break;
        case "HARD":
          data[2].value++;
          break;
        default:
          throw new Error("Invalid complexity");
      }
    });

    return data;
  } catch (error) {
    throwAndLogError(
      "getNumberOfAttemptedQuestionsByComplexity",
      "No history found",
      getError(HttpStatusCode.NOT_FOUND)
    );
  }
};

const getNumQuestionsForEachComplexity = () => {
  const data = [
    { name: "Easy", value: 5 },
    { name: "Medium", value: 8 },
    { name: "Hard", value: 20 },
  ];
  return data;
};

const createHistory = async (userId: string | string[], questionId: string) => {
  const response = await api({
    method: HTTP_METHODS.POST,
    service: historyService,
    body: {
      userId: userId,
      questionId: questionId,
    },
  });

  if (response.status === HttpStatusCode.CREATED) {
    const data = response.data;
    return data;
  }

  return throwAndLogError(
    "createHistory",
    response.message,
    getError(response.status)
  );
};

const deleteHistory = async (userId: string, questionId: string) => {
  const response = await api({
    method: HTTP_METHODS.DELETE,
    service: historyService,
    path: `/user/${userId}/questionId/${questionId}`,
  });

  if (response.status === HttpStatusCode.NO_CONTENT) {
    return true;
  }

  return throwAndLogError(
    "deleteHistory",
    response.message,
    getError(response.status)
  );
};

export const HistoryService = {
  getAttemptedQuestionIds,
  getNumberOfAttemptedQuestionsByComplexity,
  getNumQuestionsForEachComplexity,
  createHistory,
  deleteHistory,
};
