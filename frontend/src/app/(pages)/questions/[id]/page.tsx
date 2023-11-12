"use client";

import { getQuestionById } from "@/helpers/question/question_api_wrappers";
import { notFound } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import ProblemDescription from "@/components/common/ProblemDescription";
import LogoLoadingComponent from "@/components/common/LogoLoadingComponent";
import Question from "@/types/question";
import { useAuthContext } from "@/contexts/auth";
import { Role } from "@/types/enums";

async function getQuestion(id: string) {
  const response = await getQuestionById(id, "no-cache");
  if ("title" in response) {
    return response as Question;
  } else {
    notFound();
  }
}

export default async function QuestionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuthContext();
  const [question, setQuestion] = useState<Question>();
  const [isLoading, setIsLoading] = useState(true);

  const handleGetQuestion = async (id: string) => {
    setIsLoading(true);
    const rawQuestion = await getQuestion(id);
    setQuestion(rawQuestion);
    setIsLoading(false);
  };

  useEffect(() => {
    if (user.role.toUpperCase() !== Role.ADMIN) {
      return notFound();
    }

    handleGetQuestion(params.id);
  }, [user]);

  return isLoading ? (
    <LogoLoadingComponent />
  ) : (
    <ProblemDescription question={question!} />
  );
}
