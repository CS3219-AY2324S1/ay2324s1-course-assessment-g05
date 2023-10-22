import { Tabs, Tab } from "@nextui-org/react";
import { Key, use, useEffect, useState } from "react";
import TestCases from "./TestCases";
import { useCollabContext } from "@/contexts/collab";
import { useConsoleContext } from "@/contexts/console";
import LogoLoadingComponent from "@/components/common/LogoLoadingComponent";

interface IConsolePanelProps {
  isOpen: boolean;
  isCodeRunning: boolean;
}

const ConsolePanel = ({ isOpen, isCodeRunning }: IConsolePanelProps) => {
  const [selectedTab, setSelectedTab] = useState<Key>("testcase");
  const { question } = useCollabContext();
  const { isQuestionLoaded, setQuestionInConsoleContext } = useConsoleContext();

  useEffect(() => {
    setQuestionInConsoleContext(question!);
  }, [question]);

  useEffect(() => {
    isCodeRunning ? setSelectedTab("result") : setSelectedTab("testcase");
  }, [isCodeRunning]);

  return (
    <div>
      {!isQuestionLoaded ? (
        <LogoLoadingComponent />
      ) : (
        <div
          style={{ display: isOpen ? "block" : "none" }}
          className="flex flex-col w-full h-full px-2 py-2"
        >
          <Tabs
            size="md"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
          >
            <Tab key="testcase" title="Testcase">
              <TestCases />
            </Tab>
            <Tab key="result" title="Result"></Tab>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default ConsolePanel;
