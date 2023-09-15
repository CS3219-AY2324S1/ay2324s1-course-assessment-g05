enum Complexity {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard",
}

export const convertStringToComplexity = (complexity: string): Complexity => {
  switch (complexity) {
    case "easy":
      return Complexity.EASY;
    case "medium":
      return Complexity.MEDIUM;
    case "hard":
      return Complexity.HARD;
    default:
      throw new Error(`Complexity ${complexity} not found.`);
  }
};

export default Complexity;
