import { Tabs, Tab, Tooltip, Button } from "@nextui-org/react";
import { Key, useEffect } from "react";
import TestCases from "./TestCases";
import { useCollabContext } from "@/contexts/collab";
import { useConsoleContext } from "@/contexts/console";
import LogoLoadingComponent from "@/components/common/LogoLoadingComponent";
import Results from "./Results";
import { AiFillExclamationCircle } from "react-icons/ai";

interface IConsolePanelProps {
  isOpen: boolean;
  selectedConsoleTab: string;
  setSelectedConsoleTab: React.Dispatch<React.SetStateAction<string>>;
}

const ConsolePanel = ({
  isOpen,
  selectedConsoleTab,
  setSelectedConsoleTab,
}: IConsolePanelProps) => {
  const { question } = useCollabContext();
  const {
    isQuestionLoaded,
    setQuestionInConsoleContext,
    isResultsLoading,
    hasCodeRun,
  } = useConsoleContext();

  useEffect(() => {
    setQuestionInConsoleContext(question!);
  }, [question]);

  useEffect(() => {}, [isResultsLoading, hasCodeRun]);

  return (
    <div>
      {!isQuestionLoaded ? (
        <LogoLoadingComponent />
      ) : (
        <>
          <div
            style={{ display: isOpen ? "block" : "none" }}
            className="flex-col w-full h-full px-2 py-2 overflow-auto"
          >
            <Tabs
              disableAnimation
              size="md"
              selectedKey={selectedConsoleTab}
              onSelectionChange={(key: Key) =>
                setSelectedConsoleTab(key.toString())
              }
            >
              <Tab
                className="flex flex-col w-full"
                key="testcase"
                title="Testcase"
              >
                <TestCases />
              </Tab>
              <Tab className="flex flex-col w-full" key="result" title="Result">
                {!hasCodeRun ? (
                  <div
                    className={`flex flex-col pt-[15px] items-center justify-center text-gray-400 text-sm`}
                  >
                    Please run the code first.
                  </div>
                ) : isResultsLoading ? (
                  <div
                    className={`flex flex-col pt-[60px] items-center justify-center`}
                  >
                    <LogoLoadingComponent minHeight="0" />
                  </div>
                ) : (
                  <Results />
                )}
              </Tab>
            </Tabs>
          </div>
        </>
      )}
    </div>
  );
};

export default ConsolePanel;
