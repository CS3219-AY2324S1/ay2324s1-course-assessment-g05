import React, { FormEvent, useEffect } from "react";
import useSWR from "swr";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Chip,
  colors,
  Progress,
} from "@nextui-org/react";
import QuestionDescription from "./QuestionDescription";
import { TOPIC, COMPLEXITY, SERVICE } from "@/types/enums";
import Question, { Example } from "@/types/question";
import QuestionExamplesTable from "./QuestionExamplesTable";
import QuestionConstrainsTable from "./QuestionConstrainsTable";
import { CLIENT_ROUTES } from "@/common/constants";
import { Url } from "next/dist/shared/lib/router/router";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import {
  postQuestion,
  updateQuestion,
} from "@/helpers/question/question_api_wrappers";
import { FiCornerDownLeft } from "react-icons/fi";

export default function ModifyQuestionModal({
  isOpen,
  onOpenChange,
  closeCallback,
  question,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  closeCallback: () => void;
  question?: Question;
}) {
  // component mode and const
  const editMode = question != null;
  const topicSelections = Object.values(TOPIC).map((k) => ({ value: k }));
  const complexitySelections = Object.values(COMPLEXITY).map((k) => ({
    value: k,
  }));

  // component states
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState("");

  // form arguments
  const [id, setId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [complexity, setComplexity] = React.useState("EASY");
  const [topics, setTopics] = React.useState<string[]>([]);
  const [description, setDescription] = React.useState("");
  const [constrains, setConstrains] = React.useState<string[]>([]);
  const [examples, setExamples] = React.useState<Example[]>([]);
  const [url, setUrl] = React.useState("");

  // prefill form base on mode
  React.useEffect(() => {
    if (isOpen && editMode) {
      console.log(
        "[ModifyQuestionModal]: prefill form with qid:" + question?._id,
      );

      setId(question!._id!);
      setTitle(question!.title);
      setComplexity(question!.complexity);
      setTopics(question!.topics);
      setDescription(question!.description!);
      setConstrains(question!.constraints!);
      setExamples(question!.examples!);
      setUrl(question!.url!);
    } else {
      console.log("[ModifyQuestionModal]: close or open with empty form");
      setId("");
      setTitle("");
      setComplexity("EASY");
      setTopics([]);
      setDescription("");
      setConstrains([]);
      setExamples([]);
      setError("");
      setUrl("");
    }
  }, [isOpen]);

  // form action
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      question = {
        // id: id,
        title: title.trim(),
        complexity: complexity,
        topics: Array.from(topics.values()),
        description: description.trim(),
        url: url.trim(),
      };

      constrains.length > 0
        ? (question.constraints = constrains.filter((x) => x !== ""))
        : {};
      examples.length > 0
        ? (question.examples = examples.filter(
            (x) => x.input !== "" && x.output !== "",
          ))
        : {};

      const response = editMode
        ? await updateQuestion(id, question)
        : await postQuestion(question);

      let data = response.message;

      if (response.ok) {
        closeCallback();
      } else {
        setError(data as string);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Modal
        size="5xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={false}
        scrollBehavior="outside"
        classNames={{
          header: "border-b-[1px] border-[#454545]",
        }}
        isDismissable={!isLoading}
      >
        <form onSubmit={onSubmit}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  {editMode ? "Edit" : "Add"} Question
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-2">
                      {/* ID and Title fields */}
                      {/* <Input
                        name="id"
                        type="number"
                        label="No."
                        labelPlacement="outside"
                        placeholder="000"
                        className="flex-none w-20"
                        // isRequired
                        value={id}
                        isReadOnly={editMode}
                        // onValueChange={(v) =>
                        //   Number(v) > 0 ? setId(v) : setId("0")
                        // }
                        disabled={isLoading}
                      ></Input> */}
                      <Input
                        name="title"
                        type="text"
                        label="Title"
                        labelPlacement="outside"
                        placeholder="Enter question title"
                        className="flex-initial"
                        value={title}
                        isRequired
                        onValueChange={setTitle}
                        disabled={isLoading}
                      ></Input>

                      <Select
                        name="complexity"
                        isRequired
                        label="Complexity"
                        labelPlacement="outside"
                        placeholder="Choose a complexity level"
                        className="flex-none w-36"
                        selectedKeys={[complexity]}
                        items={complexitySelections}
                        onChange={(e) => setComplexity(e.target.value)}
                        disabled={isLoading}
                      >
                        {(level) => (
                          <SelectItem key={level.value}>
                            {level.value}
                          </SelectItem>
                        )}
                      </Select>

                      <Select
                        isRequired
                        label="Topics"
                        labelPlacement="outside"
                        placeholder="Select question topics"
                        selectionMode="multiple"
                        description="Allow multiple selections"
                        isMultiline={true}
                        items={topicSelections}
                        selectedKeys={topics}
                        onChange={(e) => setTopics(e.target.value.split(","))}
                        disabled={isLoading}
                      >
                        {(topic) => (
                          <SelectItem key={topic.value}>
                            {topic.value}
                          </SelectItem>
                        )}
                      </Select>
                    </div>

                    <div className="flex">
                      <Input
                        name="Url"
                        type="url"
                        label="Question Source Url"
                        labelPlacement="outside"
                        placeholder="https://leetcode.com"
                        className="flex"
                        isRequired
                        disabled={isLoading}
                        value={url}
                        onValueChange={setUrl}
                      ></Input>
                    </div>

                    {/* Description, constrain and example fields */}
                    <div className="flex">
                      <QuestionDescription
                        name="description"
                        value={description}
                        onValueChange={setDescription}
                        disabled={isLoading}
                      ></QuestionDescription>
                    </div>
                    <div className="flex flex-row gap-2">
                      <div className="flex flex-col basis-1/2">
                        <QuestionConstrainsTable
                          value={constrains}
                          onValueChange={(v) => setConstrains(v)}
                          disabled={isLoading}
                        ></QuestionConstrainsTable>
                      </div>
                      <div className="flex flex-col basis-1/2">
                        <QuestionExamplesTable
                          value={examples}
                          onValueChange={(v) => setExamples(v)}
                          disabled={isLoading}
                        ></QuestionExamplesTable>
                      </div>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="relative items-center">
                  <p className="absolute insert-x-0 left-0 py-2 px-4 text-danger">
                    {error}
                  </p>
                  <Button
                    color="primary"
                    type="submit"
                    disabled={isLoading}
                    isLoading={isLoading}
                    startContent={<FiCornerDownLeft />}
                  >
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
