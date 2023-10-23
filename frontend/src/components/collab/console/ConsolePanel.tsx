import { Tabs, Tab } from "@nextui-org/react";
import { Key, use, useEffect, useState } from "react";
import TestCases from "./TestCases";
import { useCollabContext } from "@/contexts/collab";
import { useConsoleContext } from "@/contexts/console";
import LogoLoadingComponent from "@/components/common/LogoLoadingComponent";
import Results from "./Results";

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
  const { isQuestionLoaded, setQuestionInConsoleContext } = useConsoleContext();

  useEffect(() => {
    setQuestionInConsoleContext(question!);
  }, [question]);

  return (
    <div>
      {!isQuestionLoaded ? (
        <LogoLoadingComponent />
      ) : (
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className="flex flex-col w-full h-full px-2 py-2 overflow-auto"
        >
          <Tabs
            disableAnimation
            size="md"
            selectedKey={selectedConsoleTab}
            onSelectionChange={(key: Key) =>
              setSelectedConsoleTab(key.toString())
            }
          >
            <Tab key="testcase" title="Testcase">
              <TestCases />
            </Tab>
            <Tab key="result" title="Result">
              <Results />
            </Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ConsolePanel;
