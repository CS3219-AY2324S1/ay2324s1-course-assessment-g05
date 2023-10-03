"use client";
import { useState } from "react";
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
import parse from "html-react-parser";
import Question from "@/types/question";
import ModifyQuestionModal from "./ModifyQuestionModal";
import ComplexityChip from "./ComplexityChip";
import DeleteQuestion from "./DeleteQuestion";
import { StringUtils } from "@/utils/stringUtils";
import { CLIENT_ROUTES } from "@/common/constants";
import { Icons } from "@/components/common/Icons";

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
      class: "",
    },
    {
      key: "title",
      label: "TITLE",
      class: "w-3/6",
    },
    {
      key: "complexity",
      label: "COMPLEXITY",
      class: "w-1/7",
    },
    {
      key: "topics",
      label: "TOPIC",
      class: "w-2/6",
    },
    {
      key: "actions",
      label: "ACTIONS",
      class: "",
    },
  ];

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [toEditQuestion, setToEditQuestion] = useState<Question>();

  function renderCell(item: any, columnKey: string, readonly: boolean) {
    const cellValue = item[columnKey as keyof Question];

    switch (columnKey) {
      case "_id":
        return questions.findIndex((x) => x._id == cellValue) + 1;
      case "title":
        return (
          <>
            <Link href={`${CLIENT_ROUTES.QUESTIONS}/${item._id}`}>
              {cellValue as string}
            </Link>
          </>
        );
      case "complexity":
        return (
          <ComplexityChip
            size="md"
            complexity={cellValue as string}
          ></ComplexityChip>
        );
      case "topics":
        return (
          <>
            <div className="flex flex-wrap gap-1 overflow-hidden ">
              {(cellValue as string[]).map((topic) => (
                <Tooltip
                  key={topic}
                  content={StringUtils.convertAllCapsToCamelCase(topic)}
                >
                  <Chip size="sm" className="truncate">
                    {StringUtils.convertAllCapsToCamelCase(topic)}
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
            <Tooltip content={<>{parse(item.description)}</>} delay={1000}>
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50 w-8 h-8 p-1.5">
                <Icons.FiEye />
              </span>
            </Tooltip>
            <Tooltip content="Edit question" delay={1000}>
              <span
                className="text-lg text-default-400 cursor-pointer active:opacity-50 w-8 h-8 p-1.5"
                onClick={(e) => openModal(item)}
              >
                <Icons.FiEdit />
              </span>
            </Tooltip>
            <DeleteQuestion id={item["_id"]}></DeleteQuestion>
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
              className={column.class}
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
