import { Button, Link } from "@nextui-org/react";
import { use, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface IConsoleBarProps {
  isConsoleOpen: boolean;
  setIsConsoleOpen: (isConsoleOpen: boolean) => void;
  setSelectedConsoleTab: React.Dispatch<React.SetStateAction<string>>;
}

const ConsoleBar = ({
  isConsoleOpen,
  setIsConsoleOpen,
  setSelectedConsoleTab,
}: IConsoleBarProps) => {
  const handleConsoleToggle = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  const handleRunCode = () => {
    setSelectedConsoleTab("result");
    setIsConsoleOpen(true);
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
