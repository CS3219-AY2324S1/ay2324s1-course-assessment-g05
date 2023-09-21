"use server";
import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { HTTP_METHODS, SERVICE } from "@/types/enums";
import Question from "@/types/question";
import { revalidateTag } from "next/cache";

const logger = getLogger("api");
const service = SERVICE.QUESTION;
const scope = [SERVICE.QUESTION];

type MongoQuestionList = {
  count: number;
  data: Question[];
};

type ServiceResponse = {
  ok: boolean;
  message: string;
};

type ServiceError = {
  error: string;
  message: any;
};

type FieldError = {
  code: string;
  minimum: number;
  type: string;
  inclusive: boolean;
  exact: boolean;
  message: string;
  path: string[];
};

/**
 * get: /api/questions
 * Retrieves a list of questions from the API.
 * @returns {Promise<Question[]>} - A list of questions.
 */
export async function getQuestionList(): Promise<Question[]> {
  let questions: Question[] = [];

  try {
    const res = await api({
      method: HTTP_METHODS.GET,
      service: service,
      tags: scope,
    });

    if (res.status === 200) {
      let mongoRes = res.data as MongoQuestionList;
      questions = mongoRes.data;
      logger.info(`[getQuestionList.questions] Got ${mongoRes.count} items.`);
    } else {
      throw new Error(JSON.stringify(res.message));
    }
  } catch (error) {
    logger.error(`[getQuestionList.error] ${error}`);
  }

  return questions;
}

/**
 * get: /api/questions/[id]
 * Retrieves a question by its ID from the API.
 * @param {string} id - The ID of the question to retrieve.
 * @returns {Promise<Question>} - The retrieved question.
 */
export async function getQuestionById(
  id: string,
): Promise<Question | undefined> {
  try {
    const res = await api({
      method: HTTP_METHODS.GET,
      service: service,
      path: id,
      tags: scope,
    });

    if (res.status === 200) {
      let question = res.data as Question;
      logger.info(`[getQuestionById(${id})] ${question}`);
      return question;
    } else {
      throw new Error(res.message);
    }
  } catch (error) {
    logger.error(`[getQuestionById(${id})] ${error}`);
  }
}

/**
 * post: /api/questions
 * Posts a new question to the API.
 * @param {Question} question - The question object to post.
 * @returns {Promise<{ ok: boolean, message: string }>} - A success indicator and a message.
 */
export async function postQuestion(
  question: Question,
): Promise<ServiceResponse> {
  const res = await api({
    method: HTTP_METHODS.POST,
    service: service,
    body: question,
    tags: scope,
  });

  if (res.status == 201) {
    revalidateTag(SERVICE.QUESTION);
    return {
      ok: true,
      message: res.data,
    };
  } else {
    logger.error(`[postQuestion] ${res.message}`);
    return {
      ok: false,
      message: res.data ? (res.data as ServiceError).message : res.message,
    };
  }
}

/**
 * put: /api/questions/[id]
 * Updates an existing question on the API.
 * @param {string} id - The ID of the question to update.
 * @param {Question} question - The updated question object.
 * @returns {Promise<ServiceResponse>} - A success indicator and a message.
 */
export async function updateQuestion(
  id: string,
  question: Question,
): Promise<ServiceResponse> {
  const res = await api({
    method: HTTP_METHODS.PUT,
    service: service,
    path: id,
    body: question,
    tags: scope,
  });

  if (res.status == 204) {
    revalidateTag(SERVICE.QUESTION);
    return {
      ok: true,
      message: res.data,
    };
  } else {
    logger.error(`[updateQuestion] ${JSON.stringify(res.message)}`);
    return {
      ok: false,
      message: res.data
        ? formatFieldError(JSON.parse((res.data as ServiceError).message))
        : res.message,
    };
  }
}

/**
 * delete: /api/questions/[id]
 * Deletes a question from the API by its ID.
 * @param {string} id - The ID of the question to delete.
 * @returns {Promise<ServiceResponse>} - A success indicator and a message.
 */
export async function deleteQuestion(id: string): Promise<ServiceResponse> {
  const res = await api({
    method: HTTP_METHODS.DELETE,
    service: service,
    path: id,
    tags: scope,
  });

  if (res.status == 204) {
    revalidateTag(SERVICE.QUESTION);
    return {
      ok: true,
      message: res.data,
    };
  } else {
    logger.error(`[deleteQuestion] ${res.message}`);
    return {
      ok: false,
      message: res.message,
    };
  }
}

function formatFieldError(errors: FieldError[]) {
  return errors.map((e) => `${e.path[0]}: ${e.message}`).join(", ");
}
