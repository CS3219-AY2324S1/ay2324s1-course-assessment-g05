import { Tabs, Tab } from "@nextui-org/react";
import { Key, useEffect, useState } from "react";
import TestCases from "./TestCases";

interface IConsolePanelProps {
  isOpen: boolean;
  isCodeRunning: boolean;
}

//if open from console bar, display testcase first
//if open from execution, display result first
const ConsolePanel = ({ isOpen, isCodeRunning }: IConsolePanelProps) => {
  const [selectedTab, setSelectedTab] = useState<Key>("testcase");

  useEffect(() => {
    isCodeRunning ? setSelectedTab("result") : setSelectedTab("testcase");
  }, [isCodeRunning]);

  return (
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
  );
};

export default ConsolePanel;
