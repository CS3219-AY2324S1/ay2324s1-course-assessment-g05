"use client";
import React from "react";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  Selection,
  useDisclosure,
} from "@nextui-org/react";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { MatchingService } from "@/helpers/matching/matching_api_wrappers";
import { COMPLEXITY, LANGUAGE, TOPIC } from "@/types/enums";
import { StringUtils } from "@/utils/stringUtils";
import MatchingLobby from "./MatchingLobby";
import { useAuthContext } from "@/providers/auth";

const MatchingCard = () => {
  const {
    user: { preferences: currentPreferences },
  } = useAuthContext();

  const optionsLanguages = StringUtils.convertEnumsToCamelCase(LANGUAGE);
  const optionsDifficulties = StringUtils.convertEnumsToCamelCase(COMPLEXITY);
  const optionsTopics = StringUtils.convertEnumsToCamelCase(TOPIC);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [preferences, setPreferences] = React.useState(
    currentPreferences || { languages: [], difficulties: [], topics: [] }
  );

  const handleOnSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (event.target.value === "") {
      console.log("Field required: " + event.target.name);
      // Toast to notify user
      return;
    }
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value.split(","),
    });
  };

  //for now, get matched button will print to console keys selected
  const handleGetMatchedButtonPress = () => {
    console.log(preferences);
    if (Object.values(preferences).some((x) => x.length == 0)) {
      console.log("Invalid option");
      return;
    }
    onOpen();
  };

  const handleQuickMatch = () => {
    setPreferences(preferences);
    onOpen();
  };

  return (
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
            onPress={handleGetMatchedButtonPress}
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
  );
};

export default MatchingCard;
