import Timer from "@/components/collab/Timer";
import { FC } from "react";
import Workspace from "../../../components/collab/Workspace";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
  // TODO: obtain question detail
  // TODO: create a question panel
  // TODO: create an editor panel
  // TODO: create a chat button that will open the chat panel when clicked
  // TODO: create a timer
  return (
    <div>
      {/* <Timer /> */}
      <Workspace />
    </div>
  );
};

export default page;
