// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

// Konfiguration für Komponenten (eigene + shadcn)
const componentsJestConfig = {
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
    "components/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!components/tutorial/**",
    "!components/app-sidebar.tsx",
    "!components/auth-button.tsx",
    "!components/env-var-warning.tsx",
    "!components/forgot-password-form.tsx",
    "!components/hero.tsx",
    "!components/login-form.tsx",
    "!components/logout-button.tsx",
    "!components/nav-main.tsx",
    "!components/nav-projects.tsx",
    "!components/nav-user.tsx",
    "!components/sign-up-form.tsx",
    "!components/team-switcher.tsx",
    "!components/theme-switcher.tsx",
    "!components/update-password-form.tsx",
    "!components/weissteiner-logo.tsx",
  ],
  coverageThreshold: {
    // Shadcn UI Komponenten - niedrige Priorität
    "components/ui/**/*.{js,jsx,ts,tsx}": {
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

module.exports = createJestConfig(componentsJestConfig);
