import { Textarea } from "@nextui-org/react";
import { ChangeEventHandler } from "react";

export default function QuestionTable({
  name,
  value,
  onChange,
  onValueChange,
  disabled = false,
}: {
  name?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <>
      <Textarea
        isRequired
        name={name}
        label="Description"
        labelPlacement="outside"
        placeholder="Enter question description, sample and constrains etc"
        minRows={10}
        maxRows={20}
        value={value}
        onChange={onChange}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </>
  );
}
