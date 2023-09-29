import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Questions",
    description: "coding questions",
};

export default function QuestionLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="h-screen bg-background" suppressHydrationWarning={true}>
            {children}
        </div>
    );
}
