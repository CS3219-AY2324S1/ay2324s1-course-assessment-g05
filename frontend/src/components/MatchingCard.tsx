"use client";
import React, { useEffect } from "react";
import { Button, Select, SelectItem, Selection } from "@nextui-org/react";
import { UserService } from "@/helpers/user/api_wrappers";
import { MatchingService } from "@/helpers/matching/api_wrappers";

const MatchingCard = () => {
  /* ------------------------ TODO: get from types file ----------------------- */
  const optionsLanguages = ["C++", "Python", "Java", "Javascript"];
  const optionsDifficulties = ["Easy", "Medium", "Hard"];
  const optionsTopics = ["Array", "String", "Tree", "Linked List", "Graph"];

  const [preferences, setPreferences] = React.useState(
    UserService.getUserPreferences()
  );

  const handleOnSelectionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPreferences({
      ...preferences,
      [event.target.name]: event.target.value.split(","),
    });
  };

  return (
    <div className="flex flex-col h-full justify-start gap-4 bg-black rounded-lg p-8">
      <p> Find a pair programmer </p>
      <Select
        name="languages"
        label="Progamming languages"
        selectionMode="multiple"
        placeholder="Select a language"
        selectedKeys={preferences.languages}
        className="max-w-xs"
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
        label="Difficulty levels"
        selectionMode="multiple"
        placeholder="Select a difficulty level"
        selectedKeys={preferences.difficulties}
        className="max-w-xs"
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
        className="max-w-xs"
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
        onPress={() => MatchingService.submitMatchPreferences(preferences)}
      >
        Get Matched
      </Button>
    </div>
  );
};

export default MatchingCard;
