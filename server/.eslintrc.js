/* istanbul ignore file */

const os = require("os");

const ignorePrettierNewLineErrors = ((platform) => {
    switch (platform) {
        case "win32":
            return "crlf";
        case "darwin":
            return "lf";
        default:
            return "lf";
    }
})(os.platform());

module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
    },
    plugins: ["@typescript-eslint/eslint-plugin"],
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    ignorePatterns: [".eslintrc.js", "babel.config.js", "jest.config.ts"],
    rules: {
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-namespace": "off",
        "prefer-const": "off",
        "prettier/prettier": [
            //or whatever plugin that is causing the clash
            "error",
            {
                endOfLine: ignorePrettierNewLineErrors,
                tabWidth: 4,
            },
        ],
        semi: ["error", "always"],
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",
    },
};
