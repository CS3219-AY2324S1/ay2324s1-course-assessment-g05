import { useCollabContext } from "@/contexts/collab";
import { Button, Chip } from "@nextui-org/react";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { IoIosClose, IoIosAdd } from "react-icons/io";

const TestCases = () => {
  const { question, testCaseArray, addTestCase, deleteTestCase } =
    useCollabContext();

  const [selectedCase, setSelectedCase] = useState<number>(0);

  const handleTestCaseClose = (index: number) => {
    if (testCaseArray.length === 1) return;
    deleteTestCase(index);
    setSelectedCase(index - 1);
  };

  const handleAddTestCase = () => {
    const newTestCase = {
      input: testCaseArray[selectedCase].input,
      output: testCaseArray[selectedCase].output,
    };
    addTestCase(newTestCase);
    setSelectedCase(testCaseArray.length);
  };

  useEffect(() => {}, [testCaseArray, selectedCase]);

  return (
    <div className="flex flex-col w-full h-full gap-1">
      <div className="flex flex-wrap first-letter:justify-start items-center gap-x-2">
        {testCaseArray?.map(
          (testCase: any, index: number) => (
            console.log(index, selectedCase, index === selectedCase),
            (
              <Chip
                key={index}
                radius="sm"
                style={{
                  backgroundColor:
                    index === selectedCase ? "#27272A" : "transparent",
                }}
                className="my-2 px-2 py-4"
                size="sm"
                onClose={() => handleTestCaseClose(index)}
                endContent={<IoIosClose />}
                onClick={() => setSelectedCase(index)}
              >
                Case {index + 1}
              </Chip>
            )
          )
        )}

        <Button
          size="sm"
          variant="light"
          isIconOnly
          onClick={() => handleAddTestCase()}
        >
          <IoIosAdd />
        </Button>
      </div>
      <strong className="text-white text-xs">Input: </strong>
      <pre className="bg-gray-600 bg-opacity-50 my-1 p-4 rounded-lg text-white text-xs whitespace-pre-wrap">
        {testCaseArray[selectedCase].input}
      </pre>
      <strong className="text-white text-xs">Output: </strong>
      <pre className="bg-gray-600 bg-opacity-50 my-1 p-4 rounded-lg text-white text-xs whitespace-pre-wrap">
        {testCaseArray[selectedCase].output}
      </pre>
    </div>
  );
};

export default TestCases;

/*
   <Tab key={testCase.id} title={testCase.label}>
            <strong className="text-white text-xs">Input: </strong>
            <pre className="bg-gray-600 bg-opacity-50 my-1 p-4 rounded-lg text-white text-xs whitespace-pre-wrap">
              {testCase.input}
            </pre>
            <strong className="text-white text-xs">Output: </strong>
            <pre className="bg-gray-600 bg-opacity-50 my-1 p-4 rounded-lg text-white text-xs whitespace-pre-wrap">
              {testCase.output}
            </pre>
          </Tab>

*/
