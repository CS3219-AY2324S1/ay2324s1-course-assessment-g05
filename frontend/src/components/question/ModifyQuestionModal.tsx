import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, Divider } from "@nextui-org/react";
import Question from "../../../../common/types/question";
import QuestionDescription from "./QuestionDescription";

export default function QuestionTable({ question, submitCallback, closeCallback }: {
  question?: Question,
  submitCallback?: (question: string) => void,
  closeCallback?: () => void,
}) {
  const editMode = question != null ? true : false;
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [desc, setDesc] = React.useState('')

  async function submitChanges(formData:FormData) {
    // 'use server'
    console.log("desc:" + desc)
    console.log(formData)
  }

  return (
    <>
      <Button onPress={onOpen}>{editMode ? 'Edit' : 'Add'} Question</Button>
      <Modal
        size='5xl'
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton={false}>
        <ModalContent>
          {(onClose) => (
            <>
              <form action={submitChanges}>
                <ModalHeader className="flex flex-col gap-1">{editMode ? 'Edit' : 'Add'} Question</ModalHeader>
                <ModalBody>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="basis-1/4">
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-row gap-2">
                        <Input
                          type="number"
                          label="No."
                          labelPlacement="outside"
                          placeholder="000"
                          isRequired
                          className="basis-1/3"
                        ></Input>
                        <Input
                          type="text"
                          label="Title"
                          labelPlacement="outside"
                          placeholder="Enter question title"
                          isRequired
                        ></Input>
                        </div>
                        <Select
                          isRequired
                          label="Topics"
                          labelPlacement="outside"
                          placeholder="Select question topics"
                          className="max-w-xs"
                          selectionMode="multiple"
                          description="Allow multiple selections"
                        >
                          <SelectItem value="hashmap" key={"hashmap"}>Hashmap</SelectItem>
                        </Select>
                        <Select
                          isRequired
                          label="Complexity"
                          labelPlacement="outside"
                          placeholder="Choose a complexity level"
                          defaultSelectedKeys={["easy"]}
                          className="max-w-xs"
                        >
                          <SelectItem value="easy" key={"easy"}>Easy</SelectItem>
                          <SelectItem value="medium" key={"medium"}>Medium</SelectItem>
                          <SelectItem value="hard" key={"hard"}>Hard</SelectItem>
                        </Select>
                      </div>
                    </div>
                    <div className="flex-auto">
                      <QuestionDescription value={desc} onChange={e => setDesc(e.target.value)}></QuestionDescription>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Submit
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