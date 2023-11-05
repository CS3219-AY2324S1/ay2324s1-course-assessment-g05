import { useCollabContext } from "@/contexts/collab";
import { useConsoleContext } from "@/contexts/console";
import { Button, Link, Tooltip } from "@nextui-org/react";
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
      <Tooltip
        style={{
          display: ["java", "cpp"].includes(matchedLanguage.toLowerCase())
            ? "inline-block"
            : "none",
        }}
        content="Note that checking for code correctness is only supported for Python and
        Javascript."
        placement="top-start"
      >
        <Button size="sm" onPress={handleRunCode}>
          Run
        </Button>
      </Tooltip>
      <div className="text-xs pt-2"></div>
    </div>
  );
};

export default ConsoleBar;
