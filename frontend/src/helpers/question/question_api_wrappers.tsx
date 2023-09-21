import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { SERVICE } from "@/types/enums";
import Question from "@/types/question";

const logger = getLogger("api");
const service = SERVICE.QUESTION;
const scope = ["questions"];

type MongoQuestionList = {
  count: number;
  data: Question[];
};

/**
 * get: /api/questions
 */
const getQuestionList = async () => {
  let questions: Question[] = [];

  try {
    const res = await api({
      method: "GET",
      service: service,
      path: "",
      tags: scope,
    });

    if (res.status === 200) {
      let mongoRes = res.data as MongoQuestionList;
      questions = mongoRes.data;
      logger.info(`[getQuestionList.questions]: Got ${mongoRes.count} items.`);
    } else {
      throw new Error(res.error);
    }
  } catch (error) {
    logger.error(`[getQuestionList.error]: ${error}`);
  }

  return questions;
};

/**
 * get: /api/questions/[id]
 */
const getQuestionById = async (id: string) => {
  try {
    const res = await api({
      method: "GET",
      service: service,
      path: id,
      tags: scope,
    });

    if (res.status === 200) {
      let question = res.data as Question;
      logger.info(`[getQuestionById(${id})]: ${question}`);
      return question;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    logger.error(`[getQuestionById(${id})]: ${error}`);
  }
};

/**
 * post: /api/questions
 */
const postQuestion = async (
  question: Question,
  success: (data: any) => void,
  error: (err: any) => void,
) => {
  const res = await api({
    method: "POST",
    service: service,
    path: "",
    body: question,
    tags: scope,
  });

  if (res.status == 201) {
    success(res.message);
  } else {
    logger.error(`[postQuestion]: ${res.message}`);
    error(res.message);
  }
};

/**
 * put: /api/questions/[id]
 */
const updateQuestion = async (
  id: string,
  question: Question,
  success: (data: any) => void,
  error: (err: any) => void,
) => {
  const res = await api({
    method: "PUT",
    service: service,
    path: id,
    body: question,
    tags: scope,
  });

  if (res.status == 201) {
    success(res.message);
  } else {
    logger.error(`[updateQuestion]: ${res.message}`);
    error(res.message);
  }
};

/**
 * delete: /api/questions/[id]
 */
const deleteQuestion = async (
  id: string,
  success: (data: any) => void,
  error: (err: any) => void,
) => {
  const res = await api({
    method: "DELETE",
    service: service,
    path: id,
    tags: scope,
  });

  if (res.status == 201) {
    success(res.message);
  } else {
    logger.error(`[deleteQuestion]: ${res.message}`);
    error(res.message);
  }
};

const QuestionService = {
  getQuestionList,
  getQuestionById,
  postQuestion,
  updateQuestion,
  deleteQuestion,
};

export default QuestionService;
