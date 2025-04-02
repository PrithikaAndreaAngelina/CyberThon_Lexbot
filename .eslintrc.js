module.exports = {
    env: {
      node: true,        // Enables Node.js global variables
      commonjs: true,    // Adds CommonJS module support
      es2021: true       // Supports modern JavaScript
    },
    extends: "eslint:recommended",
    parserOptions: {
      ecmaVersion: 12    // Supports ES2021 features
    },
    rules: {
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }]
    }
  };