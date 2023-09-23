import type { Metadata } from "next";
import Question from "@/types/question";
import QuestionTable from "@/components/question/QuestionTable";
import { getQuestionList } from "@/helpers/question/question_api_wrappers";
import MatchingLobby from "@/components/matching/MatchingLobby";

export const metadata: Metadata = {
  title: "Questions",
  description: "coding questions",
};

export default async function QuestionsPage() {
  const questions: Question[] = await getQuestionList();

  return (
    <>
      <QuestionTable questions={questions}></QuestionTable>
      <MatchingLobby></MatchingLobby>
    </>
  );
}
