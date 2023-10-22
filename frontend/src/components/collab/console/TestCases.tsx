import { useConsoleContext } from "@/contexts/console";
import { Button, Chip, Input, Tooltip } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IoIosClose, IoIosAdd } from "react-icons/io";
import { RxReset } from "react-icons/rx";

const TestCases = () => {
  const {
    testCaseArray,
    initialTestCaseArray,
    addTestCase,
    deleteTestCase,
    modifyTestCaseArray,
  } = useConsoleContext();

  const [selectedCase, setSelectedCase] = useState<number>(0);

  const handleTestCaseClose = (index: number) => {
    if (testCaseArray.length === 1) return;
    deleteTestCase(index);
    setSelectedCase(index - 1 < 0 ? 0 : index - 1);
  };

  const handleAddTestCase = () => {
    const newTestCase = {
      input: testCaseArray[selectedCase].input,
      output: testCaseArray[selectedCase].output,
    };
    addTestCase(newTestCase);
    setSelectedCase(testCaseArray.length);
  };

  const handleResetToDefaultTestCases = () => {
    setSelectedCase(0);
    modifyTestCaseArray([], true);
  };

  const handleModifyTestcase = (index: number, value: string, key: string) => {
    const updatedTestCaseArray = [...testCaseArray];
    if (key === "input") {
      updatedTestCaseArray[selectedCase].input = value;
    } else {
      updatedTestCaseArray[selectedCase].output = value;
    }
    modifyTestCaseArray(updatedTestCaseArray);
  };

  useEffect(() => {}, [testCaseArray, selectedCase]);

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-wrap first-letter:justify-start items-center gap-x-2">
        {testCaseArray?.map((testCase: any, index: number) => (
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
        ))}

        <Tooltip
          color="default"
          placement="top"
          size="sm"
          content="Duplicate current test case"
        >
          <Button
            size="sm"
            variant="light"
            isIconOnly
            onClick={() => handleAddTestCase()}
          >
            <IoIosAdd />
          </Button>
        </Tooltip>
        <div
          style={{
            display:
              JSON.stringify(testCaseArray) ===
              JSON.stringify(initialTestCaseArray)
                ? "none"
                : "block",
          }}
        >
          <Tooltip
            color="default"
            placement="top"
            size="sm"
            content="Reset to default test cases"
          >
            <Button
              size="sm"
              variant="light"
              isIconOnly
              onClick={handleResetToDefaultTestCases}
            >
              <RxReset size="0.9em" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <strong className="text-white text-xs">Input: </strong>
      <pre>
        <Input
          type="text"
          classNames={{
            input: "text-xs text-white py-4 text-xs",
            inputWrapper: "bg-gray-600 bg-opacity-50 p-4 rounded-lg",
          }}
          value={testCaseArray[selectedCase].input}
          onValueChange={(value: string) =>
            handleModifyTestcase(selectedCase, value, "input")
          }
        />
      </pre>

      <strong className="text-white text-xs">Expected output: </strong>
      <pre>
        <Input
          type="text"
          classNames={{
            input: "text-xs text-white py-4 text-xs",
            inputWrapper: "bg-gray-600 bg-opacity-50 p-4 rounded-lg",
          }}
          value={testCaseArray[selectedCase].output}
          onValueChange={(value: string) =>
            handleModifyTestcase(selectedCase, value, "output")
          }
        />
      </pre>
    </div>
  );
};

export default TestCases;
