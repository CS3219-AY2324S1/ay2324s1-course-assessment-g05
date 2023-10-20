import { useHistoryContext } from "@/contexts/history";
import { HistoryService } from "@/helpers/history/history_api_wrappers";
import { cn } from "@/utils/classNameUtils";
import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import { useMemo, useState } from "react";

interface AttemptedQuestionTableProps {
  isFullPage?: boolean;
}

const AttemptedQuestionTable = ({
  isFullPage = false,
}: AttemptedQuestionTableProps) => {
  let rowsPerPage = 4;
  let showTopics = false;

  if (isFullPage) {
    rowsPerPage = 12;
    showTopics = true;
  }

  const tableColumns = [
    {
      key: "title",
      label: "Title",
    },
    {
      key: "complexity",
      label: "Complexity",
    },
    ...(showTopics
      ? [
          {
            key: "topics",
            label: "Topics",
          },
        ]
      : []),
    {
      key: "submissionDate",
      label: "Submission Date",
    },
  ];
  const { history } = useHistoryContext();

  const sortedQuestionsByDate =
    HistoryService.getSortedAttemptedQuestions(history);

  // for table pagination
  const [page, setPage] = useState(1);

  const pages = Math.ceil(sortedQuestionsByDate.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedQuestionsByDate.slice(start, end);
  }, [page, sortedQuestionsByDate]);

  return (
    <Table
      aria-label="Attempted Question Table"
      isStriped={true}
      bottomContent={
        pages > 1 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="secondary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={tableColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={cn({
              "w-2/3": column.key === "title" && !showTopics,
              "w-2/5": showTopics && column.key === "title",
              "w-1/8": showTopics && column.key === "complexity",
              "w-3/10": showTopics && column.key === "topics",
            })}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      {sortedQuestionsByDate.length === 0 ? (
        <TableBody emptyContent="No rows to display">{[]}</TableBody>
      ) : (
        <TableBody items={items}>
          {(item) => {
            return (
              <TableRow key={item.id}>
                {(columnKey) => {
                  return <TableCell>{getKeyValue(item, columnKey)}</TableCell>;
                }}
              </TableRow>
            );
          }}
        </TableBody>
      )}
    </Table>
  );
};

export default AttemptedQuestionTable;
