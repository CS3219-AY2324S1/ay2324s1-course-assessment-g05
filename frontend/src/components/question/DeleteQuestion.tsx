import { deleteQuestion } from "@/helpers/question/question_api_wrappers";
import { CircularProgress } from "@nextui-org/react";
import React from "react";
import { FiTrash, FiX } from "react-icons/fi";

export default function DeleteQuestion({ id }: { id: string }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);

  async function handleDelete(id: string) {
    setIsLoading(true);

    let res = await deleteQuestion(id);

    if (res.ok) {
      console.log(`Question[${id}] deleted.`);
    } else {
      setIsLoading(false);
      setError(true);
    }
  }

  return (
    <>
      {isLoading && <CircularProgress size="sm" aria-label="Loading..." />}
      {!isLoading && (
        <span
          className="text-lg text-danger cursor-pointer active:opacity-50 w-8 h-8 p-1.5"
          onClick={(e) => handleDelete(id)}
        >
          {!error && <FiTrash />}
          {error && <FiX />}
        </span>
      )}
    </>
  );
}
