import { FC, useEffect, useState } from "react";
import { UserService } from "@/helpers/user/user_api_wrappers";
import User from "@/types/user";
import CodeEditorNavbar from "./CodeEditorNavbar";
import { useAuthContext } from "@/providers/auth";
import { Divider } from "@nextui-org/react";
import Editor from "@monaco-editor/react";
import CodeEditor from "./CodeEditor";

interface CodeEditorPanelProps {}

const CodeEditorPanel: FC<CodeEditorPanelProps> = ({}) => {
  // should get the matched details, including the chosen language and the partner
  const [partner, setPartner] = useState<User>();

  const getMatchedPartner = async () => {
    try {
      const rawMatchedUser = await UserService.getUserById(
        "clmztpxlq00007kpsvkgt9as7"
      );

      console.log(rawMatchedUser);

      if (!rawMatchedUser) throw new Error("No matched user found.");

      setPartner(rawMatchedUser);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMatchedPartner();
    console.log("Hey CodeEditorPanel");
  }, []);

  const { user } = useAuthContext();

  return (
    <div>
      <CodeEditorNavbar partner={partner!} language="C++" />
      <Divider className="space-y-2" />
      <CodeEditor />
    </div>
  );
};

export default CodeEditorPanel;
