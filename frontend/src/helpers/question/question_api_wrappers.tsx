"use server";
import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { HTTP_METHODS, SERVICE, TOPIC } from "@/types/enums";
import Question from "@/types/question";
import { revalidateTag } from "next/cache";
import { ServiceError, ServiceResponse, formatFieldError } from "../service";
import Preference from "@/types/preference";
import HttpStatusCode from "@/types/HttpStatusCode";
import { throwAndLogError } from "@/utils/errorUtils";
import { PeerPrepErrors } from "@/types/PeerPrepErrors";

const logger = getLogger("wrapper");
const service = SERVICE.QUESTION;
const scope = [SERVICE.QUESTION];

type MongoQuestionList = {
  count: number;
  data: Question[];
};

/**
 * get: /api/questions
 * Retrieves a list of questions from the API.
 * @returns {Promise<Question[]>} - A list of questions.
 */
export async function getQuestionList(): Promise<Question[]> {
  let questions: Question[] = [];

  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    tags: scope,
    cache: "no-cache",
  });

  if (response.status === 200) {
    let mongoRes = response.data as MongoQuestionList;
    questions = mongoRes.data;
    logger.info(`[getQuestionList] Got ${mongoRes.count} items.`);
  } else {
    logger.error(response, `[getQuestionList] Error:`);
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
  cache: RequestCache = "no-cache"
): Promise<Question | ServiceResponse> {
  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: id,
    tags: scope,
    cache: cache,
  });

  if (response.status === 200) {
    let question = response.data as Question;
    logger.info(`[getQuestionById(${id})] Got question: ${question.title}`);
    return question;
  } else {
    logger.error(response, `[getQuestionById(${id})] Error:`);
    return {
      ok: false,
      message: response.data ? (response.data as ServiceError).message : response.message,
    };
  }
}

/**
 * Get a question base on a set of preference
 * @param preference given preference | surprise me
 */
export async function getQuestionByPreference(
  preference: Preference | undefined,
  cache: RequestCache = "no-cache"
) {
  let questions = [];

  const complexityFilter = preference?.difficulties.map(d => `complexity=${d}`).join(`&`);
  const topicFilter = preference?.topics.map(d => `topics=${d}`).join(`&`);
  const queryPath = `?${topicFilter}&${complexityFilter}`

  const response = await api({
    method: HTTP_METHODS.GET,
    service: service,
    path: queryPath,
    tags: scope,
    cache: cache,
  });

  if (response.status === HttpStatusCode.OK) { 
    const mongoRes = response.data as MongoQuestionList;
    questions = mongoRes.data;
    logger.info(`[getQuestionByPreference] Got ${mongoRes.count} items.`);
    return questions;
  }

  return throwAndLogError(
    "getQuestionByPreference",
    response.message,
    PeerPrepErrors.InternalServerError
  );
}

export async function getTopics() {
  const response = await api({
    method: HTTP_METHODS.GET,
    service: SERVICE.TOPICS,
    tags: [SERVICE.TOPICS],
  });

  if (response.status === HttpStatusCode.OK) { 
    const topics = response.data['topics'] as string[]
    logger.info(`[getTopics] Got ${topics.length} items.`);
    return topics;
  }

  return throwAndLogError(
    "getTopics",
    response.message,
    PeerPrepErrors.InternalServerError
  );
}

/**
 * post: /api/questions
 * Posts a new question to the API.
 * @param {Question} question - The question object to post.
 * @returns {Promise<{ ok: boolean, message: string }>} - A success indicator and a message.
 */
export async function postQuestion(
  question: Question
): Promise<ServiceResponse> {
  const response = await api({
    method: HTTP_METHODS.POST,
    service: service,
    body: question,
    tags: scope,
  });

  if (response.status == 201) {
    revalidateTag(SERVICE.QUESTION);
    return {
      ok: true,
      message: response.data,
    };
  } else {
    logger.error(response, `[postQuestion] Error:`);
    return {
      ok: false,
      message: response.data ? (response.data as ServiceError).message : response.message,
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
  question: Question
): Promise<ServiceResponse> {
  const response = await api({
    method: HTTP_METHODS.PUT,
    service: service,
    path: id,
    body: question,
    tags: scope,
  });

  if (response.status == 204) {
    revalidateTag(SERVICE.QUESTION);
    return {
      ok: true,
      message: response.data,
    };
  } else {
    logger.error(response, `[updateQuestion] Error:`);
    return {
      ok: false,
      message: response.data
        ? formatFieldError(JSON.parse((response.data as ServiceError).message))
        : response.message,
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
  const response = await api({
    method: HTTP_METHODS.DELETE,
    service: service,
    path: id,
    tags: scope,
  });

  if (response.status == 204) {
    revalidateTag(SERVICE.QUESTION);
    return {
      ok: true,
      message: response.data,
    };
  } else {
    logger.error(response, `[deleteQuestion] Error:`);
    return {
      ok: false,
      message: response.message,
    };
  }
}
