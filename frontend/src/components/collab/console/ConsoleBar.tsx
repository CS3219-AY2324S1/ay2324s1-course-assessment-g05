import { useCollabContext } from "@/contexts/collab";
import { useConsoleContext } from "@/contexts/console";
import { Button, Link } from "@nextui-org/react";
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
  const { runTestCases } = useConsoleContext();
  const { matchedLanguage } = useCollabContext();
  const handleConsoleToggle = () => {
    setIsConsoleOpen(!isConsoleOpen);
  };

  const handleRunCode = async () => {
    setSelectedConsoleTab("result");
    setIsConsoleOpen(true);
    runTestCases(code, matchedLanguage);
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
