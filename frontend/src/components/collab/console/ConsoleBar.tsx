import { Button, Link } from "@nextui-org/react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface IConsoleBarProps {
  isConsoleOpen: boolean;
  setIsConsoleOpen: (isConsoleOpen: boolean) => void;
  setIsCodeRunning: (isCodeRunning: boolean) => void;
}

const ConsoleBar = ({
  isConsoleOpen,
  setIsConsoleOpen,
  setIsCodeRunning,
}: IConsoleBarProps) => {
  const handleConsoleToggle = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  const handleRunCode = () => {
    setIsCodeRunning(true);
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
