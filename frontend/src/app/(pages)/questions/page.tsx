import type { Metadata } from "next";
import Question from "../../../types/question";
import QuestionTable from "../../../components/question/QuestionTable";
import QuestionService from "../../../helpers/question/question_api_wrappers";

export const metadata: Metadata = {
  title: "Questions",
  description: "coding questions",
};

export default async function QuestionsPage() {
  const questions: Question[] = await QuestionService.getQuestionList();

  return (
    <>
      <QuestionTable questions={questions}></QuestionTable>
    </>
  );
}
