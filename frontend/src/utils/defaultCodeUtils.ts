import Question from "@/types/question";
import { StringUtils } from "./stringUtils";
import { CodeExecutorUtils } from "./codeExecutorUtils";

export const getCodeTemplate = (
  language: string,
  question: Question
): string => {
  // transform the question title into a camel case string
  const questionTitle = question.title;

  const formattedQuestionTitle =
    StringUtils.convertStringToCamelCase(questionTitle);

  const inputVariables = question.examples?.[0]?.input;

  const inputDict = CodeExecutorUtils.extractInputStringToInputDict(
    inputVariables!
  );

  const formattedInputVariables = CodeExecutorUtils.getFormattedInputVariables(
    inputDict,
    language
  );

  const formattedExampleInput = formatExampleInput(
    formattedInputVariables,
    language
  );

  switch (language.toLowerCase()) {
    case "cpp":
      return `#include <iostream>\n${formattedExampleInput}\nclass Solution {\npublic:\n\t// change the function type and arguments below if necessary\n\tvoid ${formattedQuestionTitle}(/*define your params here*/){\n\t\t\n\t};\n\n//TODO: call your function and print its output below using cout`;
    case "java":
      return `${formattedExampleInput}\npublic class Main {\n\t// change the function type and arguments below if necessary\n\tpublic static void ${formattedQuestionTitle}(/*define your params here*/) {\n\t\t\n\t}\n\n\tpublic static void main(String[] args){\n\t\t//TODO: call your function and print its output below\n\t\t// using System.out.print()\n\t}\n}\n\n`;
    case "python":
      return `${formattedExampleInput}\n#TODO: change the function arguments below \ndef ${formattedQuestionTitle}():\n\treturn\n\n#TODO: call your function and print its output below using print()`;
    case "javascript":
      return `${formattedExampleInput}\nconst ${formattedQuestionTitle} = (/*define your params here*/) => {\n\treturn;\n}\n\n//TODO: call your function and print its output below using console.log()`;
    default:
      return "";
  }
};

const formatExampleInput = (input: string, language: string) => {
  switch (language.toLowerCase()) {
    case "cpp":
    case "javascript":
      return (
        "/*\n" +
        "This is how the code executor will process the input from testcases:\n" +
        "E.G: Example 1\n" +
        `${input}` +
        "Please reserve these variables and \nuse them in your functions where necessary.\n" +
        "*/" +
        "\n"
      );
    case "java":
      return (
        "/*\n" +
        "This is how the code executor will process the input from testcases:\n" +
        "E.G: Example 1\n" +
        `${input}` +
        "Please access these variables using GlobalClass.{variableName} and \nuse them in your functions where necessary.\n" +
        "*/" +
        "\n"
      );
    case "python":
      return (
        '"""\n' +
        "This is how the code executor will process the input from testcases:\n" +
        "E.G: Example 1\n" +
        `${input}` +
        "Please reserve these variables and \nuse them in your functions where necessary.\n" +
        '"""' +
        "\n"
      );
    default:
      return "";
  }
};
