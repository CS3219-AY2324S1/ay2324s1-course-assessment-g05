import ComplexityChip from "@/components/question/ComplexityChip";
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

const tableColumns = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "complexity",
    label: "Complexity",
  },
  {
    key: "submissionDate",
    label: "Submission Date",
  },
];

const AttemptedQuestionTable = () => {
  const { history } = useHistoryContext();

  const sortedQuestionsByDate =
    HistoryService.getSortedAttemptedQuestions(history);

  // for table pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

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
      }
    >
      <TableHeader columns={tableColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            className={cn({
              "w-2/3": column.key === "title",
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
              <TableRow key={item.title}>
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
