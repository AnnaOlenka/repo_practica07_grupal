module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },

  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },

  settings: {
    react: {
      version: "detect",
    },
  },

  plugins: ["react", "react-hooks"],

  rules: {
    // Hooks
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",

    // React 17+ JSX Transform
    "react/react-in-jsx-scope": "off",

    // Desactivar prop-types
    "react/prop-types": "off",
  },
};