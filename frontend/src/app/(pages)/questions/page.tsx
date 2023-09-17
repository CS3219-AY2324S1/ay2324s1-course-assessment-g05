import type { Metadata } from "next";
import Question from "../../../types/question";
import QuestionTable from "../../../components/question/QuestionTable";
import { getQuestionList } from "../../../helpers/questions/services";

export const metadata: Metadata = {
  title: "Questions",
  description: "coding questions",
};

export default async function QuestionsPage() {
  const questions: Question[] = await getQuestionList();

  return (
    <>
      <QuestionTable questions={questions}></QuestionTable>
    </>
  );
}
