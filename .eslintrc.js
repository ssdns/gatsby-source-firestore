module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  env: { browser: true, node: true, es6: true, jest: true },
  rules: {
    "sort-imports": ["error", { ignoreDeclarationSort: true }],
    "@typescript-eslint/no-unused-vars": [1, { argsIgnorePattern: "res|next|stage|^err|on|config|e|_" }],
    "arrow-body-style": [2, "as-needed"],
    "no-param-reassign": [2, { props: false }],
    "no-unused-expressions": [1, { allowTaggedTemplates: true, allowShortCircuit: true }],
    "@typescript-eslint/explicit-function-return-type": 0,
    "no-use-before-define": "off",
    "@typescript-eslint/no-use-before-define": ["error"],
    "@typescript-eslint/camelcase": 0,
    "import/prefer-default-export": 0,
    "import/extensions": 0,
    indent: ["error", 2, { SwitchCase: 1 }],
    "prettier/prettier": [
      "error",
      { semi: false, arrowParens: "avoid", printWidth: 120, trailingComma: "es5", tabWidth: 2 },
    ],
    "no-shadow": 0,
    "no-useless-constructor": 0,
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {},
    },
  },
}
