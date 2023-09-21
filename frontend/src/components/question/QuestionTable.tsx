"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  useDisclosure,
  Button,
  Chip,
  Link,
} from "@nextui-org/react";
import Question from "@/types/question";
import ModifyQuestionModal from "./ModifyQuestionModal";
import { redirect } from "next/navigation";
import ComplexityChip from "./ComplexityChip";
import { COMPLEXITY } from "@/types/enums";
import { deleteQuestion } from "@/helpers/question/question_api_wrappers";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import DeleteQuestion from "./DeleteQuestion";

export default function QuestionTable({
  questions,
  readonly = false,
}: {
  questions: Question[];
  readonly?: Boolean;
}) {
  const columns = [
    {
      key: "_id",
      label: "NO.",
    },
    {
      key: "title",
      label: "TITLE",
    },
    {
      key: "complexity",
      label: "COMPLEXITY",
    },
    {
      key: "topics",
      label: "TOPIC",
    },
    {
      key: "actions",
      label: "ACTIONS",
    },
  ];

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [toEditQuestion, setToEditQuestion] = React.useState<Question>();

  function renderCell(item: any, columnKey: string, readonly: boolean) {
    const cellValue = item[columnKey as keyof Question];

    switch (columnKey) {
      case "_id":
        return questions.findIndex((x) => x._id == cellValue) + 1;
      case "title":
        return (
          <>
            <Link href={"questions/" + item._id}>{cellValue as string}</Link>
          </>
        );
      case "complexity":
        return (
          <ComplexityChip complexity={cellValue as string}></ComplexityChip>
        );
      case "topics":
        return (
          <>
            <div className="flex flex-row gap-1">
              {(cellValue as string[]).map((topic) => (
                <Tooltip key={topic} content={topic}>
                  <Chip size="sm" className="w-20 truncate">
                    {topic}
                  </Chip>
                </Tooltip>
              ))}
            </div>
          </>
        );

      case "actions":
        if (readonly) {
          return <></>;
        }
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content={item.description}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 w-8 h-8 p-1.5">
                <FiEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit question">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50 w-8 h-8 p-1.5"
                onClick={(e) => openModal(item)}
              >
                <FiEdit />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete question">
              <DeleteQuestion id={item["_id"]}></DeleteQuestion>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }

  function openModal(question?: Question) {
    if (question != undefined) {
      setToEditQuestion(question);
    } else {
      setToEditQuestion(undefined);
    }
    onOpen();
  }

  return (
    <>
      <ModifyQuestionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        question={toEditQuestion}
        closeCallback={onClose}
      ></ModifyQuestionModal>
      <Table
        aria-label="table of questions"
        topContent={
          <Button onPress={(e) => openModal()}>Create Question</Button>
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={questions} emptyContent={"No rows to display."}>
          {(row) => (
            <TableRow key={row._id}>
              {(columnKey) => (
                <TableCell>
                  {renderCell(row, columnKey as string, false)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
