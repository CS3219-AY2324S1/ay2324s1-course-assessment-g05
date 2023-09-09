'use client'
import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip } from "@nextui-org/react";
import Question from "../../../../common/types/question";
import ModifyQuestionModal from "./ModifyQuestionModal";

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
        key: "status",
        label: "STATUS",
    },
    {
        key: "actions",
        label: "ACTIONS",
    },
];

export default function QuestionTable({ questions, readonly = false, editCallback, deleteCallback }: {
    questions: Question[],
    readonly?: Boolean,
    editCallback?: (id: string) => void,
    deleteCallback?: (id: string) => void
}) {
    const renderCell = React.useCallback((item: Question, columnKey: string, 
        readonly: Boolean, 
        editCallback?: (id: string) => void,
        deleteCallback?: (id: string) => void) => {
        const cellValue = item[columnKey as keyof Question];

        switch (columnKey) {
            case "actions":
                if (readonly) {
                    return (<></>);
                }
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                view
                            </span>
                        </Tooltip>
                        <Tooltip content="Edit question">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={e => editCallback? editCallback(item['id']) : ''}>
                                edit
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Delete question">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={e => deleteCallback? deleteCallback(item['id']): ''}>
                                delete
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <ModifyQuestionModal></ModifyQuestionModal>
            <Table aria-label="table of questions">
                <TableHeader columns={columns}>
                    {(column) =>
                        <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
                            {column.label}
                        </TableColumn>}
                </TableHeader>
                <TableBody items={questions} emptyContent={"No rows to display."}>
                    {questions.map((row) =>
                        <TableRow key={row.id}>
                            {(columnKey) => <TableCell>{renderCell(row, columnKey.toString(), false, editCallback, deleteCallback)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}