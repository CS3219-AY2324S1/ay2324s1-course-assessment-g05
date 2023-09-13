import api from "@/helpers/endpoint";
import { getLogger } from "@/helpers/logger";
import { SERVICE } from "@/types/enums";
import Question from "@/types/question";

const logger = getLogger("api");
const service = SERVICE.QUESTION;
const scope = "questions";

/**
 * get: /api/questions
 */
export async function getQuestionList() {
  return [
    {
      id: "1",
      title: "test1",
      topics: ["greedy", "array"],
      complexity: "hard",
      description: "test1",
    },
    {
      id: "2",
      title: "test2",
      topics: ["greedy"],
      complexity: "easy",
      description: "test2",
    },
    {
      id: "3",
      title: "test3",
      topics: ["array"],
      complexity: "medium",
      description: "test3",
    },
  ];
  return await api({
    method: "GET",
    service: service,
    path: "",
    tags: ["questions"],
  });
}

/**
 * get: /api/questions/[id]
 */
export async function getQuestionById(id: string) {
  return {
    id: "1",
    title: "test",
    topics: ["greedy", "array"],
    complexity: "hard",
    description: "test",
  };
  return await api({
    method: "GET",
    service: service,
    path: id,
    tags: ["questions"],
  });
}

/**
 * post: /api/questions
 */
export async function postQuestion(formData: FormData) {
  return await api({
    method: "POST",
    service: service,
    path: "",
    body: {
      id: formData.get("id"),
      title: formData.get("title"),
      topics: formData.get("topics"),
      complexity: formData.get("complexity"),
      description: formData.get("description"),
    },
    tags: ["questions"],
  });
}

/**
 * put: /api/questions/[id]
 */
export async function updateQuestion(id: string, formData: FormData) {
  return await api({
    method: "PATCH",
    service: service,
    path: "",
    body: {
      id: id,
      title: formData.get("title"),
      topics: formData.get("topics"),
      complexity: formData.get("complexity"),
      description: formData.get("description"),
    },
    tags: ["questions"],
  });
}

/**
 * delete: /api/questions/[id]
 */
export async function deleteQuestion(id: string) {
  return await api({
    method: "DELETE",
    service: service,
    path: id,
    tags: ["questions"],
  });
}
