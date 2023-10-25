import { useCollabContext } from "@/contexts/collab";
import { useConsoleContext } from "@/contexts/console";
import { CodeExecutionService } from "@/helpers/code_execution/code_execution_api_wrappers";
import { CodeExecutorUtils } from "@/utils/codeExecutorUtils";
import { Button, Link } from "@nextui-org/react";
import { use, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface IConsoleBarProps {
  code: string;
  isConsoleOpen: boolean;
  setIsConsoleOpen: (isConsoleOpen: boolean) => void;
  setSelectedConsoleTab: React.Dispatch<React.SetStateAction<string>>;
}

const ConsoleBar = ({
  code,
  isConsoleOpen,
  setIsConsoleOpen,
  setSelectedConsoleTab,
}: IConsoleBarProps) => {
  const { testCaseArray } = useConsoleContext();
  const { matchedLanguage } = useCollabContext();
  const handleConsoleToggle = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  const handleRunCode = async () => {
    setSelectedConsoleTab("result");
    setIsConsoleOpen(true);
    let finalTestCaseArray = structuredClone(testCaseArray);
    finalTestCaseArray.map((testCase: any) => {
      testCase.input = CodeExecutorUtils.revertInputDictToInputString(
        testCase.input
      );
    });
    console.log("Final: ", finalTestCaseArray);
    console.log("Test case to try: ", finalTestCaseArray[0]);
    // console.log(code);
    // console.log(matchedLanguage);
    const id = await CodeExecutionService.executeCode(
      code,
      matchedLanguage,
      finalTestCaseArray[0]
    );
    console.log(id);
    const result = await CodeExecutionService.checkCodeExecutionStatus(id);
    console.log(result);
  };

  return (
    <div className="flex flex-row justify-start px-5 gap-x-10 py-2">
      <Link
        href="#"
        color="foreground"
        showAnchorIcon
        anchorIcon={isConsoleOpen ? <FiChevronDown /> : <FiChevronUp />}
        onClick={handleConsoleToggle}
        className="text-sm"
      >
        Console
      </Link>
      <Button size="sm" onPress={handleRunCode}>
        Run
      </Button>
    </div>
  );
};

export default ConsoleBar;
