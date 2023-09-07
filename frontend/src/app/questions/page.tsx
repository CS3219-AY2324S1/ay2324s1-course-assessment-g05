import type { Metadata } from "next";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { getLogger } from "@/helpers/logger";
import api from "@/helpers/endpoint";
import { Service } from '../../types/enums';
import Question from '../../../../common/types/question';
import QuestionTable from "../../components/QuestionTable";

export const metadata: Metadata = {
    title: 'Questions',
    description: 'coding questions'
}

const columns = [
    {
        key: "No.",
        label: "NO.",
    },
    {
        key: "Title",
        label: "TITLE",
    },
    {
        key: "Complexity",
        label: "COMPLEXITY",
    },
    {
        key: "Status",
        label: "STATUS",
    },
];

export default async function QuestionsPage() {
    // api call to question service
    const questions: Question[] = await api({method:'GET', service:Service.QUESTION, path:''})
    
    return (
        <>
            <QuestionTable questions={questions}></QuestionTable>
        </>
    );
}
