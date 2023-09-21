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
import QuestionService from "@/helpers/question/question_api_wrappers";

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

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [toEditQuestion, setToEditQuestion] = React.useState<Question>();

  function renderCell(
    item: any,
    columnKey: string,
    readonly: boolean,
    deleteCallback?: (id: string) => void,
  ) {
    const cellValue = item[columnKey as keyof Question];

    switch (columnKey) {
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
                <Chip key={topic}>{topic}</Chip>
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
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                Preview
              </span>
            </Tooltip>
            <Tooltip content="Edit question">
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                onClick={(e) => openModal(item)}
              >
                Edit
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete question">
              <span
                className="text-lg text-danger cursor-pointer active:opacity-50"
                onClick={(e) =>
                  deleteCallback ? deleteCallback(item["_id"]!) : ""
                }
              >
                Delete
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }

  async function handleDelete(id: string) {
    QuestionService.deleteQuestion(
      id,
      (res) => {
        // redirect on success
      },
      (err) => {
        // prompt on error
      },
    );
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
      <Button onPress={(e) => openModal()}>Create Question</Button>
      <ModifyQuestionModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        question={toEditQuestion}
      ></ModifyQuestionModal>
      <Table aria-label="table of questions">
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
                  {renderCell(row, columnKey as string, false, handleDelete)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
