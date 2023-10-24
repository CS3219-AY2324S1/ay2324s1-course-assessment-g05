/* -------------------------------------------------------------------------- */
/*                      mock backend for history service                      */
/* -------------------------------------------------------------------------- */

import { DOMAIN, HTTP_METHODS } from "@/types/enums";
import api from "../endpoint";
import { getLogger } from "../logger";
import HttpStatusCode from "@/types/HttpStatusCode";
import History, { DataItem, QuestionHistory } from "@/types/history";
import { getError, throwAndLogError } from "@/utils/errorUtils";
import { StringUtils } from "../../utils/stringUtils";

const logger = getLogger("history_api_wrappers");

const historyService = DOMAIN.HISTORY;

const getAttemptedQuestionsHistory = async (userId: string) => {
  const queryParam = `?userId=${userId}`;
  const response = await api({
    method: HTTP_METHODS.GET,
    service: historyService,
    path: queryParam,
  });

  if (response.status === HttpStatusCode.OK) {
    const history = response.data;

    const data: QuestionHistory[] = [];

    if (Array.isArray(history.data)) {
      history.data.map((record: History) => {
        const languages = record.languages;
        languages.forEach((language) => {
          data.push({
            id: record.id,
            questionId: record.questionId,
            title: record.question.title,
            complexity: record.question.complexity,
            topics: record.question.topics,
            language: language,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          });
        });
      });

      return data;
    }
  }

  return throwAndLogError(
    "getAttemptedQuestions",
    response.message,
    getError(response.status)
  );
};

const getNumberOfAttemptedQuestionsByComplexity = (
  history: QuestionHistory[],
  requireSorting: boolean = true
): DataItem[] => {
  if (!history || history.length === 0) {
    return [];
  }

  const complexityCountMap = new Map<string, number>();
  const questionSet = new Set<string>();

  history.forEach((record) => {
    const complexity = StringUtils.convertStringToTitleCase(record.complexity);

    if (!questionSet.has(record.questionId)) {
      if (complexityCountMap.has(complexity)) {
        const count = complexityCountMap.get(complexity)!;
        complexityCountMap.set(complexity, count + 1);
      } else {
        complexityCountMap.set(complexity, 1);
      }
      questionSet.add(record.questionId);
    }
  });

  const data: DataItem[] = [];

  complexityCountMap.forEach((value, key) => {
    data.push({ name: key, value: value });
  });

  if (requireSorting) {
    data.sort((a, b) => {
      return b.value - a.value;
    });
  }

  return data;
};

const getNumberOfAttemptedQuestionsByTopic = (
  history: QuestionHistory[],
  requireSorting: boolean = true
): DataItem[] => {
  if (!history || history.length === 0) {
    return [];
  }

  const topicCountMap = new Map<string, number>();

  const questionSet = new Set<string>();

  history.forEach((record) => {
    if (!questionSet.has(record.questionId)) {
      questionSet.add(record.questionId);

      const topics = record.topics.map((topic) =>
        StringUtils.convertStringToTitleCase(topic)
      );

      topics.forEach((topic) => {
        if (topicCountMap.has(topic)) {
          const count = topicCountMap.get(topic)!;
          topicCountMap.set(topic, count + 1);
        } else {
          topicCountMap.set(topic, 1);
        }
      });
    }
  });

  const data: DataItem[] = [];
  topicCountMap.forEach((value, key) => {
    data.push({ name: key, value: value });
  });

  if (requireSorting) {
    data.sort((a, b) => {
      return b.value - a.value;
    });
  }

  return data;
};

const getNumberOfAttemptedQuestionsByLanguage = (
  history: QuestionHistory[],
  requireSorting: boolean = true
): DataItem[] => {
  if (!history || history.length === 0) {
    return [];
  }

  const languageCountMap = new Map<string, number>();

  history.forEach((record) => {
    if (languageCountMap.has(record.language)) {
      const count = languageCountMap.get(record.language)!;
      languageCountMap.set(record.language, count + 1);
    } else {
      languageCountMap.set(record.language, 1);
    }
  });

  const data: DataItem[] = [];

  languageCountMap.forEach((value, key) => {
    data.push({ name: key, value: value });
  });

  if (requireSorting) {
    data.sort((a, b) => {
      return b.value - a.value;
    });
  }

  return data;
};

const getNumberOfAttemptedQuestionsByDate = (history: QuestionHistory[]) => {
  if (!history || history.length === 0) {
    return [];
  }

  const dateCountMap = new Map<number, number>();

  history.forEach((question) => {
    const date: number = new Date(question.updatedAt).getTime();

    if (dateCountMap.has(date)) {
      const count = dateCountMap.get(date)!;
      dateCountMap.set(date, count + 1);
    } else {
      dateCountMap.set(date, 1);
    }
  });

  const data: { date: number; value: number }[] = [];
  dateCountMap.forEach((value, key) => {
    data.push({ date: key, value: value });
  });
  return data;
};

const getQuestionCodeSubmission = async (
  userId: string,
  questionId: string,
  language: string
) => {
  const temporaryCodeData = `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        for i in range(len(nums)):
            for j in range(i+1, len(nums)):
                if nums[i]+nums[j] == target:
                    return [i, j]
        return [-1, -1]`;
  const promise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ language: language, code: temporaryCodeData });
    }, 1500);
  });
  return promise;
  // const response = await api({
  //   method: HTTP_METHODS.GET,
  //   service: historyService,
  //   path: `/user/${userId}/questionId/${questionId}/code?language=${encodeURIComponent(language)}`,
  // });

  // if (response.status === HttpStatusCode.OK) {
  //   const data = response.data as { language: string, code: string };
  //   return data;
  // }

  // return throwAndLogError(
  //   "getQuestionCodeSubmission",
  //   response.message,
  //   getError(response.status)
  // );
};

const createHistory = async (
  userId: string | string[],
  questionId: string,
  language: string
) => {
  const response = await api({
    method: HTTP_METHODS.POST,
    domain: historyService,
    body: {
      userId: userId,
      questionId: questionId,
      language: language,
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
    domain: historyService,
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
  getNumberOfAttemptedQuestionsByTopic: getNumberOfAttemptedQuestionsByTopic,
  getNumberOfAttemptedQuestionsByLanguage,
  getNumberOfAttemptedQuestionsByDate,
  getQuestionCodeSubmission,
  createHistory,
  deleteHistory,
};
