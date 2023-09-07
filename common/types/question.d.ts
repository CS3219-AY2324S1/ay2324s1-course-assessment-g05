interface Question {
    id: string,
    title: string,
    complexity: string,
    description?: string,
    category?: string[],
    status?: string,
    createdOn?: string,
    updatedOn?: string,
    author?: string,
    url?: string,
}

export default Question;