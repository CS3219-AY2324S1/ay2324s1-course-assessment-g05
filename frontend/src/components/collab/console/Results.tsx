import { useConsoleContext } from "@/contexts/console";
import { Chip } from "@nextui-org/react";
import test from "node:test";
import { useMemo, useState } from "react";
import { GoDotFill } from "react-icons/go";

const Results = () => {
  const { testCaseArray } = useConsoleContext();
  const [selectedCase, setSelectedCase] = useState<number>(0);

  const isDefaultTestCase = useMemo(() => {
    return testCaseArray[selectedCase].output ? true : false;
  }, [selectedCase, testCaseArray]);

  const isCorrect = useMemo(() => {
    return testCaseArray[selectedCase].output ===
      testCaseArray[selectedCase].actualOutput
      ? true
      : false;
  }, [selectedCase]);

  return (
    <div className="flex flex-col w-full h-full gap-2">
      <div className="flex flex-wrap first-letter:justify-start items-center gap-x-2">
        {testCaseArray?.map((testCase: any, index: number) => (
          //TODO: if test case is custom, give a "question mark" icon
          <Chip
            key={index}
            radius="sm"
            startContent={<GoDotFill color={isCorrect ? "green" : "red"} />}
            style={{
              backgroundColor:
                index === selectedCase ? "#27272A" : "transparent",
            }}
            className="my-2 px-2 py-4"
            size="sm"
            onClick={() => setSelectedCase(index)}
          >
            Case {index + 1}
          </Chip>
        ))}
      </div>

      {Object.entries(testCaseArray[selectedCase].input).map(
        ([variableName, variableValue]: [string, any]) => (
          <div key={variableName}>
            <div className="text-white text-xs py-1"> {variableName} = </div>
            <pre className="bg-gray-600 bg-opacity-50 px-4 py-3 rounded-lg text-white text-xs whitespace-pre-wrap">
              {variableValue}
            </pre>
          </div>
        )
      )}
      <div className="text-white text-xs py-1">Expected output: </div>
      {isDefaultTestCase ? (
        <pre className="bg-gray-600 bg-opacity-50 px-4 py-3 rounded-lg text-white text-xs whitespace-pre-wrap">
          {testCaseArray[selectedCase].output}
        </pre>
      ) : (
        <pre className="bg-gray-600 bg-opacity-50 px-4 py-3 rounded-lg text-gray-400 text-xs whitespace-pre-wrap">
          Not available for custom inputs
        </pre>
      )}
      <div className="text-white text-xs">Actual output: </div>
      <pre className="bg-gray-600 bg-opacity-50 px-4 py-3 rounded-lg text-xs whitespace-pre-wrap">
        <div
          style={{
            color: isDefaultTestCase ? (isCorrect ? "green" : "red") : "white",
          }}
        >
          Actual output
        </div>
      </pre>
    </div>
  );
};

export default Results;
