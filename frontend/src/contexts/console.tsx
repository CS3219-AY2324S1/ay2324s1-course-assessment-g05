import Question from "@/types/question";
import { createContext, useContext, useState } from "react";
import parse from "html-react-parser";
import { extractInputStringToInputDict } from "@/utils/codeExecutorUtils";

interface IConsoleContext {
  isQuestionLoaded: boolean;
  setQuestionInConsoleContext: (question: Question) => void;
  testCaseArray: any[];
  initialTestCaseArray: any[];
  deleteTestCase: (index: number) => void;
  addTestCase: (testCase: {}) => void;
  modifyTestCaseArray: (testCases: any[], resetToDefault?: boolean) => void;
}

interface IConsoleProvider {
  children: React.ReactNode;
}

const ConsoleContext = createContext<IConsoleContext>({
  isQuestionLoaded: false,
  setQuestionInConsoleContext: (question: Question) => {},
  testCaseArray: [],
  initialTestCaseArray: [],
  deleteTestCase: (index: number) => {},
  addTestCase: (testCase: {}) => {},
  modifyTestCaseArray: (testCases: any[], resetToDefault?: boolean) => {},
});

const useConsoleContext = () => useContext(ConsoleContext);

const ConsoleProvider = ({ children }: IConsoleProvider) => {
  const [initialTestCaseArray, setInitialTestCaseArray] = useState<any[]>([]);
  const [testCaseArray, setTestCaseArray] = useState<any[]>([]);
  const [isQuestionLoaded, setIsQuestionLoaded] = useState<boolean>(false);

  const setQuestionInConsoleContext = (question: Question) => {
    const initialTestCaseArray = question.examples?.map(
      (example: any, index: number) => ({
        input: extractInputStringToInputDict(parse(example.input) as string),
        output: parse(example.output),
      })
    );
    setInitialTestCaseArray(initialTestCaseArray!);
    setTestCaseArray(structuredClone(initialTestCaseArray!));
    setIsQuestionLoaded(true);
  };

  const deleteTestCase = (index: number) => {
    const updatedTestCaseArray = [...testCaseArray];
    updatedTestCaseArray.splice(index, 1);
    setTestCaseArray(updatedTestCaseArray);
  };

  const addTestCase = (testCase: {}) => {
    const updatedTestCaseArray = [...testCaseArray];
    updatedTestCaseArray.push(testCase);
    setTestCaseArray(updatedTestCaseArray);
  };

  const modifyTestCaseArray = (testCases: any[], resetToDefault?: boolean) => {
    if (resetToDefault) {
      setTestCaseArray(structuredClone(initialTestCaseArray));
    } else {
      setTestCaseArray([...testCases]);
    }
  };

  const context = {
    isQuestionLoaded,
    setQuestionInConsoleContext,
    testCaseArray,
    initialTestCaseArray,
    deleteTestCase,
    addTestCase,
    modifyTestCaseArray,
  };

  return (
    <ConsoleContext.Provider value={context}>
      {children}
    </ConsoleContext.Provider>
  );
};

export { ConsoleProvider, useConsoleContext };
