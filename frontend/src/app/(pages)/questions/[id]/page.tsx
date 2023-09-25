import { getQuestionById } from "@/helpers/question/question_api_wrappers";
import Question from "@/types/question";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import parse from 'html-react-parser';

async function getQuestion(id: string) {
  const res = await getQuestionById(id, 'no-cache');

  if ('title' in res) {
    return res as Question;
  } else {
    notFound();
  }
}

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const question = await getQuestion(params.id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <p>{question._id}</p>
      <p>{question.complexity}</p>
      <p>{question.topics}</p>
      {/* will need to render the description in client side */}
      {parse(question.description!)}
    </Suspense>
  );
}
