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
} from "@nextui-org/react";
import QuestionDescription from "./QuestionDescription";
import {
  getQuestionById,
  postQuestion,
  updateQuestion,
} from "@/app/(pages)/questions/api";
import { TOPIC, COMPLEXITY } from "@/types/enums";
import Question from "@/types/question";

export default function ModifyQuestionModal({
  isOpen,
  onOpenChange,
  question,
}: {
  isOpen: boolean;
  onOpenChange: () => void;
  question?: Question;
}) {
  // component mode and const
  const editMode = question != null;
  const topicSelections = Object.values(TOPIC).flatMap((k) => ({
    label: k.toLowerCase(),
    value: k.toLowerCase(),
  }));
  const complexitySelections = Object.values(COMPLEXITY).flatMap((k) => ({
    label: k.toLowerCase(),
    value: k.toLowerCase(),
  }));
  const initialState = {
    id: "",
    title: "",
    complexity: ["easy"],
    topics: new Set<string>([]),
    description: "",
  };

  // component states
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [form, setForm] = React.useState(initialState);

  // prefill form base on mode
  useEffect(() => {
    if (isOpen && editMode) {
      console.log(
        "[ModifyQuestionModal]: prefill form with qid:" + question?.id,
      );

      setForm({
        id: question!.id,
        title: question!.title,
        complexity: [question!.complexity],
        topics: question!.topics,
        description: question!.description || "",
      });
    } else {
      console.log("[ModifyQuestionModal]: close or open with empty form");
      setForm(initialState);
    }
  }, [isOpen]);

  // form action
  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      formData.append("topics", JSON.stringify(Array.from(form.topics)));
      formData.forEach((element) => {
        console.log(element);
      });
      // formData.append('topics', JSON.stringify(topics.values))
      // const response = editMode ? await updateQuestion(question!.id, formData) : await postQuestion(formData)

      // const data = await response.json()
      // console.log(data);
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
      >
        <ModalContent>
          {() => (
            <>
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">
                  {editMode ? "Edit" : "Add"} Question
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex basis-1/4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2">
                          {editMode ? (
                            <Input
                              name="id"
                              type="number"
                              label="No."
                              labelPlacement="outside"
                              placeholder="000"
                              className="basis-1/3"
                              value={form.id}
                              isReadOnly
                            ></Input>
                          ) : (
                            <Input
                              name="id"
                              type="number"
                              label="No."
                              labelPlacement="outside"
                              placeholder="000"
                              isRequired
                              className="basis-1/3"
                            ></Input>
                          )}
                          <Input
                            name="title"
                            type="text"
                            label="Title"
                            labelPlacement="outside"
                            placeholder="Enter question title"
                            value={form.title}
                            isRequired
                            onChange={(e) =>
                              setForm({
                                ...form,
                                title: e.target.value,
                              })
                            }
                          ></Input>
                        </div>
                        <Select
                          name="complexity"
                          isRequired
                          label="Complexity"
                          labelPlacement="outside"
                          placeholder="Choose a complexity level"
                          selectedKeys={form.complexity}
                          className="max-w-xs"
                          items={complexitySelections}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              complexity: [e.target.value],
                            })
                          }
                        >
                          {(level) => (
                            <SelectItem key={level.value}>
                              {level.label}
                            </SelectItem>
                          )}
                        </Select>
                        <Select
                          isRequired
                          label="Topics"
                          labelPlacement="outside"
                          placeholder="Select question topics"
                          className="max-w-xs"
                          selectionMode="multiple"
                          description="Allow multiple selections"
                          isMultiline={true}
                          items={topicSelections}
                          selectedKeys={form.topics}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              topics: new Set<string>(
                                e.target.value.split(","),
                              ),
                            })
                          }
                        >
                          {(topic) => (
                            <SelectItem key={topic.value}>
                              {topic.label}
                            </SelectItem>
                          )}
                        </Select>
                      </div>
                    </div>
                    <div className="flex basis-3/4">
                      <QuestionDescription
                        name="description"
                        value={form.description}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            description: e.target.value,
                          })
                        }
                      ></QuestionDescription>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Submit"}
                  </Button>
                </ModalFooter>
              </form>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
