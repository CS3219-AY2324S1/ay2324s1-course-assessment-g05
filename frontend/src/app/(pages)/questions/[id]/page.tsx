"use client"
import Question from "@/types/question";
import { getQuestionById } from "../api";
import { useParams } from "next/navigation";

export default async function QuestionDetailPage() {
    const params = useParams()
    const question: Question = await getQuestionById(params.id as string);
  
    return (
      <>
        <p>{question.id}</p>
        <p>{question.complexity}</p>
        <p>{question.topics}</p>
        <p>{question.description}</p>
      </>
    );
  }