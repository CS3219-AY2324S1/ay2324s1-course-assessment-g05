"use client";

import { getQuestionById } from "@/helpers/question/question_api_wrappers";
import Question from "@/types/question";
import { useEffect, useState } from "react";
import ProblemDescription from "./ProblemDescription";

const ProblemPanel = ({}) => {
  // const question = await getMatchedQuestion();
  // hardcode this to get reverse string
  const [question, setQuestion] = useState<Question>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const renderQuestionDetails = async () => {
    setIsLoading(true);
    try {
      const rawQuestion = (await getQuestionById(
        "650a5979bf32dcb1ae15bf11"
      )) as Question;

      if (!rawQuestion) {
        throw new Error("Question not found");
      }

      setQuestion(rawQuestion);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    renderQuestionDetails();
  }, []);
  return (
    <div className="h-screen">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProblemDescription question={question!} />
      )}
    </div>
  );
};

export default ProblemPanel;
