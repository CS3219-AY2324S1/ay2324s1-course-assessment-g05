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

  const formattedInputVariables = CodeExecutorUtils.getFormattedInputVariables(
    inputVariables!,
    language
  );

  console.log("This is my formatted input variables", formattedInputVariables);

  const formattedExampleInput = formatExampleInput(
    formattedInputVariables,
    language
  );

  switch (language.toLowerCase()) {
    case "cpp":
      return `${formattedExampleInput}\nclass Solution {\npublic:\n\t// change the function type and arguments below if necessary\n\tvoid ${formattedQuestionTitle}(/*define your params here*/){\n\t\t\n\t};\n\n//TODO: call your function and print its output below}`;
    case "java":
      return `${formattedExampleInput}\nclass Solution {\n\t// change the function type and arguments below if necessary\n\tpublic static void ${formattedQuestionTitle}(/*define your params here*/) {\n\t\t\n\t}\n}\n\n//TODO: call your function and print its output below`;
    case "python":
      return `${formattedExampleInput}\nclass Solution(object):\n\t# change the function type and arguments below if necessary\n\tdef ${formattedQuestionTitle}():\n\t\treturn\n\n#TODO: call your function and print its output below`;
    case "javascript":
      return `${formattedExampleInput}\nconst ${formattedQuestionTitle} = (/*define your params here*/) => {\n\treturn;\n}\n\n//TODO: call your function and print its output below`;
    default:
      return "";
  }
};

const formatExampleInput = (input: string, language: string) => {
  switch (language.toLowerCase()) {
    case "cpp":
    case "java":
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
