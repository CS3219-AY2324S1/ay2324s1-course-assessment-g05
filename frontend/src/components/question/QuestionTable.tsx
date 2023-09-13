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
} from "@nextui-org/react";
import Question from "../../types/question";
import ModifyQuestionModal from "./ModifyQuestionModal";
import { deleteQuestion } from "@/app/(pages)/questions/api";
import { redirect } from "next/navigation";

export default function QuestionTable({
    questions,
    readonly = false,
}: {
    questions: Question[];
    readonly?: Boolean;
}) {
    const columns = [
        {
            key: "id",
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
        item: Question,
        columnKey: string,
        readonly: Boolean,
        deleteCallback?: (id: string) => void,
    ) {
        const cellValue = item[columnKey as keyof Question];

        switch (columnKey) {
            case "topics":
                return (<>
                    <div className="flex flex-row gap-1">
                        {
                            (cellValue as string[]).map(topic => (<Chip key={topic}>{topic}</Chip>))
                        }
                    </div>
                </>)
            
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
                                    deleteCallback ? deleteCallback(item["id"]) : ""
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
        deleteQuestion(id);
        // use router to refresh table
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
                    {questions.map((row) => (
                        <TableRow key={row.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(row, columnKey.toString(), false, handleDelete)}
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}
