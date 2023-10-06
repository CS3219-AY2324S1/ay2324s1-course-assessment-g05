type Preferences = {
  code?: string,
  languages: Language[];
  languageCode?: string;
  difficulties: Difficulty[];
  difficultyCode?: string;
  topics: Topic[];
  topicCode?: string;
};

export default Preferences;