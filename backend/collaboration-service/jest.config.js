/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  resetMocks: true,
  testPathIgnorePatterns: ["src/__tests__/utils"],
  // setupFilesAfterEnv: ["<rootDir>/src/__tests__/utils/setup.ts"],
};
