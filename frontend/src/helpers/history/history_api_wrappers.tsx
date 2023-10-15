/* -------------------------------------------------------------------------- */
/*                      mock backend for history service                      */
/* -------------------------------------------------------------------------- */

import { HTTP_METHODS, SERVICE } from "@/types/enums";
import api from "../endpoint";
import { getLogger } from "../logger";
import HttpStatusCode from "@/types/HttpStatusCode";
import History, { DataItem } from "@/types/history";
import { getError, throwAndLogError } from "@/utils/errorUtils";

const logger = getLogger("history_api_wrappers");

const historyService = SERVICE.HISTORY;

const getAttemptedQuestionsHistory = async (userId: string) => {
  // temporary hardcode solution
  const history: History[] = [
    {
      userId: "currentUserId",
      questionId: "questionId1",
      title: "Question 1",
      topics: ["Array", "String"],
      language: "Python",
      complexity: "Easy",
      createdAt: "2023-08-01T00:00:00.000Z",
    },
    {
      userId: "currentUserId",
      questionId: "questionId2",
      title: "Question 2",
      topics: ["Dynammic Programming", "Hash tabe", "Memoization"],
      language: "C++",
      complexity: "Medium",
      createdAt: "2023-10-01T00:00:00.000Z",
    },
    {
      userId: "currentUserId",
      questionId: "questionId3",
      title: "Question 3",
      topics: ["Graph"],
      language: "Java",
      complexity: "Hard",
      createdAt: "2023-09-01T00:00:00.000Z",
    },
    {
      userId: "currentUserId",
      questionId: "questionId4",
      title: "Question 4",
      topics: ["Graph"],
      language: "Javascript",
      complexity: "Hard",
      createdAt: "2023-09-24T00:00:00.000Z",
    },
    {
      userId: "currentUserId",
      questionId: "questionId5",
      title: "A very long long long long long long long name Question 5",
      topics: ["Graph", "String"],
      language: "Javascript",
      complexity: "Hard",
      createdAt: "2023-07-24T23:40:11.289Z",
    },
  ];

  const promise = new Promise<History[]>((resolve) => {
    setTimeout(() => {
      resolve(history);
    }, 1000);
  });

  const historyData = await promise;

  return historyData;

  // const queryParam = `?userId=${userId}`;
  // const response = await api({
  //   method: HTTP_METHODS.GET,
  //   service: historyService,
  //   path: queryParam,
  // });

  // if (response.status === HttpStatusCode.OK) {
  //   const data = response.data as History[];
  //   return data;
  // }

  // return throwAndLogError(
  //   "getAttemptedQuestions",
  //   response.message,
  //   getError(response.status)
  // );
};

const getNumberOfAttemptedQuestionsByComplexity = (
  history: History[]
): DataItem[] => {
  const data: DataItem[] = [
    { name: "Easy", value: 0 },
    { name: "Medium", value: 0 },
    { name: "Hard", value: 0 },
  ];

  history.forEach((question) => {
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
};

const getNumberOfAttemptedQuestionsByTopic = (
  history: History[]
): DataItem[] => {
  const topicCountMap = new Map<string, number>();

  history.forEach((question) => {
    const topics = question.topics;
    topics.forEach((topic) => {
      if (topicCountMap.has(topic)) {
        const count = topicCountMap.get(topic)!;
        topicCountMap.set(topic, count + 1);
      } else {
        topicCountMap.set(topic, 1);
      }
    });
  });

  const data: DataItem[] = [];
  topicCountMap.forEach((value, key) => {
    data.push({ name: key, value: value });
  });

  return data;
};

const getNumberOfAttemptedQuestionsByLanguage = (
  history: History[]
): DataItem[] => {
  const languageCountMap = new Map<string, number>();

  history.forEach((question) => {
    const language = question.language;
    if (languageCountMap.has(language)) {
      const count = languageCountMap.get(language)!;
      languageCountMap.set(language, count + 1);
    } else {
      languageCountMap.set(language, 1);
    }
  });

  const data: DataItem[] = [];
  languageCountMap.forEach((value, key) => {
    data.push({ name: key, value: value });
  });
  return data;
};

const getNumQuestionsForEachComplexity = () => {
  const data: DataItem[] = [
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
  getAttemptedQuestionsHistory,
  getNumberOfAttemptedQuestionsByComplexity,
  getNumberOfAttemptedQuestionsByTopic,
  getNumberOfAttemptedQuestionsByLanguage,
  getNumQuestionsForEachComplexity,
  createHistory,
  deleteHistory,
};
