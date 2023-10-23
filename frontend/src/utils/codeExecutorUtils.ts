//TODO: for each supported language, add input into the source code to be sent to judge0

export const extractInputStringToInputDict = (inputString: string) => {
  const inputMap: { [key: string]: string } = {};

  const splitInputString = inputString.split(", ");

  if (splitInputString.length === 1) {
    // Case 1
    // Input: "123"
    // Output: {input: 123}
    inputMap["input"] = splitInputString[0].trim();
  } else {
    // Case 2
    // Input: "a=1, b=2, c=3"
    // Output: {a: 1, b: 2, c: 3}
    splitInputString.map((inputVariable) => {
      const [variableName, variableValue] = inputVariable
        .split("=")
        .map((x) => x.trim());
      inputMap[variableName] = variableValue;
    });
  }

  return inputMap;
};

export const revertInputDictToInputString = (inputMap: {
  [variableName: string]: [variableValue: any];
}) => {
  const inputStringArray = Object.entries(inputMap).map(
    ([variableName, variableValue]) => {
      return `${variableName}=${variableValue}`;
    }
  );

  const inputString = inputStringArray.join(", ");

  return inputString;
};
