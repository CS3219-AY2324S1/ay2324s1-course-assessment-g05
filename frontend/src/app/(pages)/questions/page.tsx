import type { Metadata } from "next";
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, getKeyValue } from "@nextui-org/table";
import { getLogger } from "@/helpers/logger";
import api from "@/helpers/endpoint";
import { Service } from '../../../types/enums';
import Question from '../../../../../common/types/question';
import QuestionTable from "../../../components/QuestionTable";
import router from "next/router";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { type } from "os";
import { RedirectType } from "next/dist/client/components/redirect";

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

async function handleEdit(id:string) {
    "use server";
    console.log('edit:' + id)
    revalidateTag('questions') 
    redirect(`/questions/${id}/edit`)
}

async function handleDelete(id:string) {
    "use server";
    console.log('del:' + id)

    await api({method:'DELETE', service:Service.QUESTION, path:id})
    revalidateTag('questions')
}

export default async function QuestionsPage() {
    // api call to question service
    const questions: Question[] = await api({method:'GET', service:Service.QUESTION, path:'', tags: ['questions']})
    
    return (
        <>
            <QuestionTable questions={questions} editCallback={handleEdit} deleteCallback={handleDelete}></QuestionTable>
        </>
    );
}
