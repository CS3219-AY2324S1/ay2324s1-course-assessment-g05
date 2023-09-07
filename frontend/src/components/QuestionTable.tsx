'use client'
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import Question from "../../../common/types/question";

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
];

export default function QuestionTable({ questions }: {questions:Question[]}) {
    return (
        <>
            <Table aria-label="table of questions">
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={questions} emptyContent={"No rows to display."}>
                    {questions.map((row) =>
                        <TableRow key={row.id}>
                            {(columnKey) => <TableCell>{getKeyValue(row, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}