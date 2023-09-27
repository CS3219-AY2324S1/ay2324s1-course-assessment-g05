"use client";

import User from "@/types/user";
import { FC, useEffect, useState } from "react";
import { Icons } from "../common/Icons";
import { Code, Spacer, Tooltip } from "@nextui-org/react";
import CodeEditorNavBarTooltip from "./CodeEditorNavBarTooltip";
import ProfilePictureAvatar from "../common/ProfilePictureAvatar";
import Timer from "./Timer";

interface CodeEditorNavbarProps {
  partner: User;
  language: string;
}

const CodeEditorNavbar: FC<CodeEditorNavbarProps> = ({ partner, language }) => {
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);

  const handleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };

  useEffect(() => {
    function exitHandler(e: any) {
      if (!document.fullscreenElement) {
        setIsFullScreen(false);
        return;
      }
      setIsFullScreen(true);
    }

    if (document.addEventListener) {
      document.addEventListener("fullscreenchange", exitHandler);
      document.addEventListener("webkitfullscreenchange", exitHandler);
      document.addEventListener("mozfullscreenchange", exitHandler);
      document.addEventListener("MSFullscreenChange", exitHandler);
    }
  }, [isFullScreen]);

  useEffect(() => {
    if (partner) {
      setIsReady(true);
    }
  }, [partner]);

  return (
    <div className="flex items-center justify-between h-11 w-full">
      {/* Show the coding language matched */}
      <div className="flex items-center m-2">
        <div className="text-lg">
          <Icons.BsFileEarmarkCode />
        </div>
        <CodeEditorNavBarTooltip content={`Code using ${language}`}>
          <Code className="text-sm bg-gray-400 bg-opacity-50 mx-2 text-opacity-80">
            {language}
          </Code>
        </CodeEditorNavBarTooltip>
      </div>

      <Spacer />

      <Spacer />

      {isReady ? (
        <CodeEditorNavBarTooltip content="Timer">
          <div>
            <Timer />
          </div>
        </CodeEditorNavBarTooltip>
      ) : (
        <></>
      )}

      {/* Show partner avatar */}
      {partner?.name ? (
        <div className="flex items-center justify-end m-2">
          <CodeEditorNavBarTooltip content={partner.name}>
            <div>
              <ProfilePictureAvatar profileUrl={partner.image!} size="8" />
            </div>
          </CodeEditorNavBarTooltip>
        </div>
      ) : (
        <></>
      )}

      {/* Buttons for some interaction */}
      <div className="flex items-center m-2">
        <CodeEditorNavBarTooltip content="Reset to default code definition">
          <button
            className="relative px-2 py-1.5 mr-2 ml-auto hover:bg-gray-200 hover:bg-opacity-40 rounded-md transition-all"
            onClick={() => {}}
          >
            <div className="h-4 w-4 text-lg">
              <Icons.RxReset color="white" />
            </div>
          </button>
        </CodeEditorNavBarTooltip>

        <CodeEditorNavBarTooltip content="Full Screen">
          <button
            className="relative px-2 py-1.5 mr-2 ml-auto hover:bg-gray-200 hover:bg-opacity-40 rounded-md transition-all"
            onClick={handleFullScreen}
          >
            <div className="h-4 w-4 text-lg">
              {!isFullScreen ? (
                <Icons.BiFullscreen />
              ) : (
                <Icons.BiExitFullscreen />
              )}
            </div>
          </button>
        </CodeEditorNavBarTooltip>
      </div>
    </div>
  );
};

export default CodeEditorNavbar;
