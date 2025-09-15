// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Konfiguration für kritische Bereiche (lib, hooks)
const criticalJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
  },
  collectCoverageFrom: [
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!lib/test-config.ts",
    "!lib/supabase/test-client.ts",
    "!lib/supabase/middleware.ts",
  ],
  coverageThreshold: {
    // Lib Code - hohe Priorität (realistische Ziele basierend auf aktueller Abdeckung)
    "lib/**/*.{js,jsx,ts,tsx}": {
      branches: 50,
      functions: 25,
      lines: 50,
      statements: 50,
    },
    // Hooks - hohe Priorität (aktuell keine Tests, aber Ziel setzen)
    "hooks/**/*.{js,jsx,ts,tsx}": {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  testTimeout: 10000,
  maxWorkers: "50%",
  verbose: true,
};

module.exports = createJestConfig(criticalJestConfig);
