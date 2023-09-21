import { Example } from "@/types/question";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";
import { FiPlus } from "react-icons/fi";

export default function QuestionConstrainsTable({
  value,
  edit = true,
  onValueChange,
}: {
  value: string[];
  edit?: boolean;
  onValueChange?: (value: string[]) => void;
}) {
  const emptyConstrain = { id: value.length, value: "" };
  const [constrains, setConstrains] = React.useState([emptyConstrain]);

  // Apply changes and pass back to parent
  const handleValue = (id: number, value: string) => {
    constrains[constrains.findIndex((x) => x.id === id)].value = value;
    onValueChange!(constrains.map((x) => x.value));
  };

  // Handle changes from parent
  React.useEffect(() => {
    if (value[value.length - 1] !== "") {
      setConstrains([
        ...value.map((v, idx) => ({ id: idx, value: v })),
        emptyConstrain,
      ]);
    } else if (value[value.length - 2] === "") {
      setConstrains(
        value.slice(0, -1).map((v, idx) => ({ id: idx, value: v })),
      );
    }
  }, [value]);

  return (
    <Table
      removeWrapper
      topContent={<p className="text-small">Constrains</p>}
      topContentPlacement="outside"
      classNames={{
        td: "p-1",
      }}
    >
      <TableHeader>
        <TableColumn>{}</TableColumn>
        <TableColumn>Values</TableColumn>
      </TableHeader>
      <TableBody items={constrains}>
        {(row) => (
          <TableRow key={row.id}>
            <TableCell>{row.id + 1}.</TableCell>
            <TableCell>
              <Input
                size="sm"
                defaultValue={row.value}
                onValueChange={(e) => handleValue(row.id, e)}
              ></Input>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
