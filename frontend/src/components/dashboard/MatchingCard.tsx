"use client";
import React from "react";
import { Button, Select, SelectItem, Selection } from "@nextui-org/react";
import { UserService } from "@/helpers/user/user_api_wrappers";
import { MatchingService } from "@/helpers/matching/matching_api_wrappers";
import { COMPLEXITY, LANGUAGE, TOPIC } from "@/types/enums";
import { StringUtils } from "@/utils/stringUtils";
import { useAuthContext } from "@/providers/auth";

const MatchingCard = () => {
  const {
    user: { preferences: currentPreferences },
  } = useAuthContext();
  const optionsLanguages = StringUtils.convertEnumsToCamelCase(LANGUAGE);
  const optionsDifficulties = StringUtils.convertEnumsToCamelCase(COMPLEXITY);
  const optionsTopics = StringUtils.convertEnumsToCamelCase(TOPIC);

  const [preferences, setPreferences] = React.useState(
    currentPreferences || { languages: [], difficulties: [], topics: [] }
  );

  const handleOnSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value.split(","),
    });
  };

  //for now, get matched button will print to console keys selected
  const handleGetMatchedButtonPress = () => {
    MatchingService.submitMatchPreferences(preferences);
  };

  return (
    <div className="flex flex-col h-full justify-start gap-4 bg-black rounded-lg p-6 text-sm overflow-hidden">
      <p> Find a pair programmer </p>
      <Select
        name="languages"
        label="Progamming languages"
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

      <Button
        className="bg-yellow text-black"
        onPress={handleGetMatchedButtonPress}
      >
        Get Matched
      </Button>
    </div>
  );
};

export default MatchingCard;
