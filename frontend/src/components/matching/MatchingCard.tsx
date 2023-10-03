"use client";
import { ChangeEvent, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { COMPLEXITY, LANGUAGE, TOPIC, ToastType } from "@/types/enums";
import { StringUtils } from "@/utils/stringUtils";
import MatchingLobby from "./MatchingLobby";
import { useAuthContext } from "@/providers/auth";
import Preference from "@/types/preference";
import displayToast from "../common/Toast";

const MatchingCard = () => {
  const {
    user: { preferences: currentPreferences },
  } = useAuthContext();

  const optionsLanguages = StringUtils.convertEnumsToCamelCase(LANGUAGE);
  const optionsDifficulties = StringUtils.convertEnumsToCamelCase(COMPLEXITY);
  const optionsTopics = StringUtils.convertEnumsToCamelCase(TOPIC);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [preferences, setPreferences] = useState<Preference>(
    currentPreferences || { languages: [], difficulties: [], topics: [] }
  );

  const handleOnSelectionChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === "") {
      displayToast(`${event.target.name} is required`);
      return;
    }
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value.split(","),
    });
  };

  //for now, get matched button will print to console keys selected
  const handleGetMatched = () => {
    if (Object.values(preferences).some((x) => x.length == 0)) {
      displayToast(`Invalid matching options.`, ToastType.ERROR);
      return;
    }
    onOpen();
  };

  const handleQuickMatch = () => {
    setPreferences(preferences);
    handleGetMatched();
  };

  return (
    <>
      {preferences && (
        <Card className="flex flex-col h-full bg-black rounded-lg text-sm overflow-hidden p-2">
          <CardHeader className="p-2">Find a pair programmer</CardHeader>
          <CardBody className="flex flex-col  gap-4 p-2">
            <Select
              isRequired
              size="sm"
              name="languages"
              label="Programming languages"
              selectionMode="multiple"
              placeholder="Select a language"
              selectedKeys={preferences.languages}
              onChange={handleOnSelectionChange}
              errorMessage={
                preferences.languages.length == 0 && <span>Language is required</span>
              }
            >
              {optionsLanguages.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              size="sm"
              name="difficulties"
              label="Complexity"
              selectionMode="multiple"
              placeholder="Select a complexity level"
              selectedKeys={preferences.difficulties}
              onChange={handleOnSelectionChange}
              errorMessage={
                preferences.difficulties.length == 0 && <span>Difficulty is required</span>
              }
            >
              {optionsDifficulties.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>

            <Select
              isRequired
              size="sm"
              name="topics"
              label="Topics"
              selectionMode="multiple"
              placeholder="Select a topic"
              selectedKeys={preferences.topics}
              onChange={handleOnSelectionChange}
              errorMessage={
                preferences.topics.length == 0 && <span>Topics is required</span>
              }
            >
              {optionsTopics.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </Select>

            <ButtonGroup>
              <Button
                color="success"
                className="text-black"
                onPress={handleQuickMatch}
              >
                Quick Match
              </Button>
              <Button
                className="bg-yellow text-black"
                onPress={handleGetMatched}
              >
                Get Matched
              </Button>
            </ButtonGroup>
            <MatchingLobby
              isOpen={isOpen}
              onClose={onClose}
              options={preferences}
            ></MatchingLobby>
          </CardBody>
        </Card>
      )}
    </>
  );
};

export default MatchingCard;
