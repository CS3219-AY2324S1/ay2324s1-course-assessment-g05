"use client";

import { getQuestionById } from "@/helpers/question/question_api_wrappers";
import Question from "@/types/question";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProblemDescription from "@/components/collab/ProblemDescription";

export default function QuestionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [question, setQuestion] = useState<Question>();

  async function getQuestion(id: string) {
    const res = await getQuestionById(id, "no-cache");

    if ("title" in res) {
      const question = res as Question;
      setQuestion(question);
    } else {
      notFound();
    }
  }

  useEffect(() => {
    getQuestion(params.id);
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {question !== undefined && <ProblemDescription question={question} />}
    </Suspense>
  );
}
