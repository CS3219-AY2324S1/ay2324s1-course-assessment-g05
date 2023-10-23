import { useConsoleContext } from "@/contexts/console";
import { Chip } from "@nextui-org/react";
import { useState } from "react";
import { GoDotFill } from "react-icons/go";

const Results = () => {
  const { testCaseArray } = useConsoleContext();
  const [selectedCase, setSelectedCase] = useState<number>(0);
  const isCorrect = false;

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
      <pre className="bg-gray-600 bg-opacity-50 px-4 py-3 rounded-lg text-white text-xs whitespace-pre-wrap">
        {testCaseArray[selectedCase].output}
      </pre>
      <div className="text-yellow text-xs">Actual output: </div>
      <pre className="bg-gray-600 bg-opacity-50 px-4 py-3 rounded-lg text-white text-xs whitespace-pre-wrap">
        Actual output
      </pre>
    </div>
  );
};

export default Results;
