export const defaultCode = (language: string): string => {
  switch (language.toLowerCase()) {
    case "cpp":
      return `#include <iostream>\nusing namespace std;\n\nint main() {\n\tcout << "Hello World!";\n\treturn 0;\n}`;
    case "java":
      return `public class Solution {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World!");\n\t}\n}`;
    case "python":
      return `print("Hello World!")`;
    case "javascript":
      return `console.log("Hello World!")`;
    default:
      return "";
  }
};
