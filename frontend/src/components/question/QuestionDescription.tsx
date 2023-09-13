import { Textarea } from "@nextui-org/react";
import { ChangeEventHandler } from "react";

export default function QuestionTable({
  name,
  value,
  onChange,
}: {
  name?: string;
  value?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <>
      <Textarea
        name={name}
        label="Description"
        labelPlacement="outside"
        placeholder="Enter question description, sample and constrains etc"
        minRows={20}
        maxRows={20}
        value={value}
        onChange={onChange}
      />
    </>
  );
}
