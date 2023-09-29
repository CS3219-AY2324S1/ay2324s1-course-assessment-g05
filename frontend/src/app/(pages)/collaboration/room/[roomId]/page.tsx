"use client";

import Workspace from "@/components/collab/Workspace";
import { MatchingService } from "@/helpers/matching/matching_api_wrappers";
import { getQuestionById } from "@/helpers/question/question_api_wrappers";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { useAuthContext } from "@/providers/auth";
import Question from "@/types/question";
import User from "@/types/user";
import { notFound } from "next/navigation";
import { FC, useEffect, useState } from "react";

interface pageProps {
  params: {
    roomId: string;
  };
}

const page: FC<pageProps> = ({ params: { roomId } }) => {
  // first check if the current user is logged in
  const { user } = useAuthContext();

  if (!user) {
    return notFound();
  }

  // connect to the room by calling backend, related to collaboration service
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const [partner, setPartner] = useState<User>();
  const [question, setQuestion] = useState<Question>();
  const [matchedLanguage, setMatchedLanguage] = useState<string>("");

  const handleConnectToRoom = async () => {
    setIsLoading(true);
    try {
      // TODO: update this when matching service is available
      // check if a match is established => at least a partner, a question, and a room id is returned
      const { secondUserId, questionId, matchedLanguage } =
        MatchingService.getMatchedRecord({
          firstUserId: user.id ?? "cln1l7jer0000t2ykbb11njys",
          secondUserId: "cln1arksi00007k9wxqsyxpzv",
          questionId: "650a5979bf32dcb1ae15bf11",
          matchedLanguage: "javascript",
        });

      if (!matchedLanguage) {
        return notFound();
      }

      setMatchedLanguage(matchedLanguage);

      // TODO: refactor this to Promise.all

      const partner = await UserService.getUserById(secondUserId);

      if (!partner) {
        return notFound();
      }

      setPartner(partner);

      const question = (await getQuestionById(questionId)) as Question;

      if (!question) {
        return notFound();
      }

      setQuestion(question);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleConnectToRoom();
  }, []);

  // FE requirements:
  // TODO: create a chat button that will open the chat panel when clicked

  return (
    <div>
      {isLoading ? (
        <>
          <p>
            Need some loading animation, can refer to how instagram, facebook
            loads
          </p>
        </>
      ) : (
        <Workspace
          roomId={roomId}
          partner={partner!}
          question={question!}
          language={matchedLanguage}
        />
      )}
    </div>
  );
};

export default page;
