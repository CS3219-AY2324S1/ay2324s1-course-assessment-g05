import { Example } from "@/types/question";
import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

export default function QuestionExamplesTable({
  value,
  edit = true,
  onValueChange,
  disabled = false,
}: {
  value: Example[];
  edit?: boolean;
  onValueChange?: (value: Example[]) => void;
  disabled?: boolean;
}) {
  const emptyExample = { id: value.length, input: "", output: "" };
  const [examples, setExamples] = React.useState([emptyExample]);

  // Apply changes and pass back to parent
  const handleValue = (id: number, key: keyof Example, value: string) => {
    examples[examples.findIndex((x) => x.id === id)][key] = value;
    onValueChange!(
      examples.map((x) => ({ input: x.input, output: x.output }) as Example),
    );
  };

  // Handle changes from parent
  React.useEffect(() => {
    if (value.length < 1) {
      return;
    }

    if (value[value.length - 1].input + value[value.length - 1].output !== "") {
      setExamples([
        ...value.map((v, idx) => ({
          id: idx,
          input: v.input,
          output: v.output,
        })),
        emptyExample,
      ]);
    } else if (
      value[value.length - 2].input + value[value.length - 2].output ===
      ""
    ) {
      setExamples(
        value
          .slice(0, -1)
          .map((v, idx) => ({ id: idx, input: v.input, output: v.output })),
      );
    }
  }, [value, disabled]);

  return (
    <Table
      aria-label="table of examples"
      removeWrapper
      topContent={<p className="text-small">Examples</p>}
      topContentPlacement="outside"
      classNames={{
        td: "p-1",
      }}
    >
      <TableHeader>
        <TableColumn>{}</TableColumn>
        <TableColumn>Input</TableColumn>
        <TableColumn>Output</TableColumn>
      </TableHeader>
      <TableBody items={examples}>
        {(row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id + 1}.</TableCell>
            <TableCell>
              <Input
                size="sm"
                defaultValue={row.input}
                onValueChange={(e) => handleValue(row.id, "input", e)}
                disabled={disabled}
              ></Input>
            </TableCell>
            <TableCell>
              <Input
                size="sm"
                defaultValue={row.output}
                onValueChange={(e) => handleValue(row.id, "output", e)}
                disabled={disabled}
              ></Input>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
