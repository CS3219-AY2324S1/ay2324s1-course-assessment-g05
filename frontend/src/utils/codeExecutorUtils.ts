const prepareCodeForExecution = (
  inputString: string,
  code: string,
  language: string
) => {
  const formattedInputStrings = getFormattedInputVariables(
    inputString,
    language
  );
  console.log("Submitting these:");
  console.log(formattedInputStrings);
  const formattedCode = `${formattedInputStrings}\n${code}`;
  console.log(formattedCode);

  return formattedCode;
};

const extractInputStringToInputDict = (inputString: string) => {
  const inputDict: { [key: string]: string } = {};

  const splitInputString = inputString.split(", ");

  if (splitInputString.length === 1) {
    const splitByEqualInputString = inputString.split("=");
    if (splitByEqualInputString.length === 1) {
      // Case 1.1
      // Input: "123"
      // Output: {input: 123}
      inputDict["input"] = splitInputString[0].trim();
    } else {
      // Case 1.2
      // Input: "a=1"
      // Output: {a: 1}
      inputDict[splitByEqualInputString[0].trim()] =
        splitByEqualInputString[1].trim();
    }
  } else {
    // Case 2
    // Input: "a=1, b=2, c=3"
    // Output: {a: 1, b: 2, c: 3}
    splitInputString.map((inputVariable) => {
      const [variableName, variableValue] = inputVariable
        .split("=")
        .map((x) => x.trim());
      inputDict[variableName] = variableValue;
    });
  }

  return inputDict;
};

const revertInputDictToInputString = (inputMap: {
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

const getJudge0LanguageId = (language: string) => {
  switch (language) {
    case "python":
      return 71;
    case "java":
      return 26;
    case "cpp":
      return 54;
    case "javascript":
      return 29;
    default:
      throw new Error("Language not supported");
  }
};

const getFormattedInputVariables = (
  inputVariablesString: string,
  language: string
) => {
  const inputDict = extractInputStringToInputDict(inputVariablesString);

  console.log("This my input dict!", inputDict);
  let formattedInputVariables = "";
  // iterate through the inputDict and return the input variable formatted as string
  Object.entries(inputDict).forEach(([variableName, variableValue]) => {
    const variableType = getVariableType(variableValue);
    switch (variableType) {
      case VariableType.BOOLEAN:
        formattedInputVariables += formatBooleanType(
          variableName,
          variableValue,
          language
        );
        break;
      case VariableType.ARRAY:
        formattedInputVariables += formatArrayType(
          variableName,
          variableValue,
          language
        );
        break;
      case VariableType.STRING:
        formattedInputVariables += formatStringType(
          variableName,
          variableValue,
          language
        );
        break;
      case VariableType.INTEGER:
        formattedInputVariables += formatIntegerType(
          variableName,
          variableValue,
          language
        );
        break;
      case VariableType.DOUBLE:
        formattedInputVariables += formatDoubleType(
          variableName,
          variableValue,
          language
        );
        break;
      default:
        break;
    }
  });
  return formattedInputVariables;
};

const formatBooleanType = (
  variableName: string,
  value: string,
  language: string
) => {
  switch (language.toLowerCase()) {
    case "cpp":
      return `#include <iostream>\nbool ${variableName} = ${value};\n`;
    case "java":
      return `boolean ${variableName} = ${value};\n`;
    case "python":
      return `${variableName} = ${value}\n`;
    case "javascript":
      return `const ${variableName} = ${value};\n`;
    default:
      return "";
  }
};

const formatStringType = (
  variableName: string,
  value: string,
  language: string
) => {
  switch (language.toLowerCase()) {
    case "cpp":
      return `#include <string> \n std::strong ${variableName} = ${value};\n`;
    case "java":
      return `String ${variableName} = ${value};\n`;
    case "python":
      return `${variableName} = ${value}\n`;
    case "javascript":
      return `const ${variableName} = ${value};\n`;
    default:
      return "";
  }
};

const formatArrayType = (
  variableName: string,
  value: string,
  language: string
) => {
  const variableType = getVariableType(
    value.split("[")[1].split(",")[0].trim()
  );

  switch (language.toLowerCase()) {
    case "cpp":
      if (variableType === VariableType.STRING) {
        return `#include <string>\nstd::string ${variableName}[] = {${value}};\n`;
      } else if (variableType === VariableType.INTEGER) {
        return `int ${variableName}[] = {${value}};\n`;
      } else if (variableType === VariableType.DOUBLE) {
        return `double ${variableName}[] = {${value}};\n`;
      } else if (variableType === VariableType.BOOLEAN) {
        return `#include <iostream>\nbool ${variableName}[] = {${value}};\n`;
      } else {
        return "NOT SUPPORTED";
      }
    case "java":
      if (variableType === VariableType.STRING) {
        return `String[] ${variableName} = ${value};\n`;
      } else if (variableType === VariableType.INTEGER) {
        return `int[] ${variableName} = ${value};\n`;
      } else if (variableType === VariableType.DOUBLE) {
        return `double[] ${variableName} = ${value};\n`;
      } else if (variableType === VariableType.BOOLEAN) {
        return `boolean[] ${variableName} = ${value};\n`;
      } else {
        return "NOT SUPPORTED";
      }
    case "python":
      return `${variableName} = ${value}\n`;
    case "javascript":
      return `const ${variableName} = ${value};\n`;
    default:
      return "NOT SUPPORTED";
  }
};

const formatIntegerType = (
  variableName: string,
  value: string,
  language: string
) => {
  switch (language.toLowerCase()) {
    case "cpp":
      return `int ${variableName} = ${value};\n`;
    case "java":
      return `int ${variableName} = ${value};\n`;
    case "python":
      return `${variableName} = ${value}\n`;
    case "javascript":
      return `const ${variableName} = ${value};\n`;
    default:
      return "";
  }
};

const formatDoubleType = (
  variableName: string,
  value: string,
  language: string
) => {
  switch (language.toLowerCase()) {
    case "cpp":
      return `double ${variableName} = ${value}; \n`;
    case "java":
      return `double ${variableName} = ${value}; \n`;
    case "python":
      return `${variableName} = ${value} \n`;
    case "javascript":
      return `const ${variableName} = ${value}; \n`;
    default:
      return "";
  }
};

const enum VariableType {
  ARRAY = "array",
  STRING = "string",
  INTEGER = "integer",
  DOUBLE = "double",
  BOOLEAN = "boolean",
}

const getVariableType = (variable: string) => {
  if (variable.toLowerCase() === "true" || variable.toLowerCase() === "false") {
    return VariableType.BOOLEAN;
  }

  if (variable.startsWith("[") && variable.endsWith("]")) {
    return VariableType.ARRAY;
  }

  if (variable.startsWith('"xw') && variable.endsWith('"')) {
    return VariableType.STRING;
  }

  if (variable.includes(".")) {
    return VariableType.DOUBLE;
  }

  if (/^\d+$/.test(variable)) {
    return VariableType.INTEGER;
  }
  return VariableType.STRING;
};

export const CodeExecutorUtils = {
  prepareCodeForExecution,
  extractInputStringToInputDict,
  revertInputDictToInputString,
  getJudge0LanguageId,
  getFormattedInputVariables,
  getVariableType,
};
