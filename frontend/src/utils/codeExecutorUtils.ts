import { Judge0Language, Judge0Status } from "@/types/judge0";

/* -------------------------------------------------------------------------- */
/*                               Code Execution                               */
/* -------------------------------------------------------------------------- */
const prepareCodeForExecution = (
  inputDict: { [variableName: string]: string },
  code: string,
  language: string
) => {
  const formattedInputStrings = getFormattedInputVariables(inputDict, language);

  let formattedCode = "";
  if (language.toLowerCase() === "java") {
    formattedCode = code.replace(
      "public class Main {",
      `public class Main {\n\t${formattedInputStrings}\n`
    );
  } else {
    formattedCode = `${formattedInputStrings}\n${code}`;
  }
  return formattedCode;
};

const checkCorrectnessOfOutput = (
  actualOutput: string,
  expectedOutput: string
) => {
  if (expectedOutput === "") {
    return false;
  }
  if (actualOutput === "" && expectedOutput !== "") {
    return false;
  }

  //standardise "" to '
  if (actualOutput.includes('"')) {
    actualOutput = actualOutput.replace(/"/g, "'");
  }
  if (expectedOutput.includes('"')) {
    expectedOutput = expectedOutput.replace(/"/g, "'");
  }

  if (getVariableType(expectedOutput) === VariableType.STRING) {
    return (
      actualOutput === expectedOutput ||
      actualOutput === expectedOutput.replace(/"/g, "").trim()
    );
  }
  if (getVariableType(expectedOutput) === VariableType.INTEGER) {
    return parseInt(actualOutput) === parseInt(expectedOutput);
  }
  if (getVariableType(expectedOutput) === VariableType.DOUBLE) {
    return parseFloat(actualOutput) === parseFloat(expectedOutput);
  }
  if (getVariableType(expectedOutput) === VariableType.BOOLEAN) {
    return actualOutput.toLowerCase() === expectedOutput.toLowerCase();
  } else {
    // Remove whitespace from both strings
    const actualOutputWithoutWhitespace = actualOutput
      .replace(/\s/g, "")
      .trim();
    const expectedOutputWithoutWhitespace = expectedOutput
      .replace(/\s/g, "")
      .trim();
    return actualOutputWithoutWhitespace === expectedOutputWithoutWhitespace;
  }
};

const getOutputMessage = (
  statusId: number,
  description: string,
  isCorrect: boolean,
  isDefaultTestCase: boolean
) => {
  if (statusId === Judge0Status.ACCEPTED && isDefaultTestCase && isCorrect) {
    return "Correct Answer";
  }
  if (statusId === Judge0Status.ACCEPTED && isDefaultTestCase && !isCorrect) {
    return "Wrong Answer";
  }

  if (statusId === Judge0Status.ACCEPTED && !isDefaultTestCase) {
    return "Code Executed Successfully";
  }

  return description;
};

const getJudge0LanguageId = (language: string) => {
  switch (language) {
    case "python":
      return Judge0Language.PYTHON;
    case "java":
      return Judge0Language.JAVA;
    case "cpp":
      return Judge0Language.CPP;
    case "javascript":
      return Judge0Language.JAVASCRIPT;
    default:
      throw new Error("Language not supported");
  }
};

/* -------------------------------------------------------------------------- */
/*                       Extracting User Input Variables                      */
/* -------------------------------------------------------------------------- */
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

/* -------------------------------------------------------------------------- */
/*                         Determining Input Variables                        */
/* -------------------------------------------------------------------------- */
const getFormattedInputVariables = (
  inputDict: { [variableName: string]: string },
  language: string
) => {
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

/* -------------------------------------------------------------------------- */
/*                     Determine the type of the variable                     */
/* -------------------------------------------------------------------------- */
const enum VariableType {
  ARRAY = "array",
  STRING = "string",
  INTEGER = "integer",
  DOUBLE = "double",
  BOOLEAN = "boolean",
}

const getVariableType = (variable: string) => {
  if (!variable) {
    return VariableType.STRING;
  }

  if (variable.startsWith("[") && variable.endsWith("]")) {
    return VariableType.ARRAY;
  }

  if (variable.startsWith('"') && variable.endsWith('"')) {
    return VariableType.STRING;
  }

  if (variable.includes(".")) {
    return VariableType.DOUBLE;
  }

  if (/^\d+$/.test(variable)) {
    return VariableType.INTEGER;
  }

  if (variable.toLowerCase() === "true" || variable.toLowerCase() === "false") {
    return VariableType.BOOLEAN;
  }

  return VariableType.STRING;
};

/* -------------------------------------------------------------------------- */
/*            Format the input variables based on type and language           */
/* -------------------------------------------------------------------------- */
const formatBooleanType = (
  variableName: string,
  value: string,
  language: string
) => {
  switch (language.toLowerCase()) {
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
  const variableType = value.split("[[")[1]
    ? VariableType.ARRAY
    : value.split("[")[1].split(",")[1]
    ? getVariableType(value.split("[")[1].split(",")[0].trim())
    : getVariableType(value.split("[")[1].split("]")[0].trim());

  switch (language.toLowerCase()) {
    case "python":
      value = value.replace(/null/g, "None");
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
    case "python":
      return `${variableName} = ${value} \n`;
    case "javascript":
      return `const ${variableName} = ${value}; \n`;
    default:
      return "";
  }
};

export const CodeExecutorUtils = {
  prepareCodeForExecution,
  checkCorrectnessOfOutput,
  getOutputMessage,
  getJudge0LanguageId,
  extractInputStringToInputDict,
  getFormattedInputVariables,
  getVariableType,
};
