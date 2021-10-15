module.exports = {
  testPathIgnorePatterns: ["/node_modules"],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"],
  testEnvironment: "jsdom",
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{tsx}", "!src/**/*.spec.tsx"],
  coverageReporters: ["lcov", "json"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
};
