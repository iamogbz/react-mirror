import { fixupConfigRules } from "@eslint/compat";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/.circleci/",
        "**/artifacts/",
        "**/internals/",
        "**/server/",
        "**/docs/",
        "**/node_modules/",
        "**/lib/",
        "**/built/",
    ],
}, ...fixupConfigRules(compat.extends(
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
)), {
    plugins: {
        "simple-import-sort": simpleImportSort,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
            ...globals.jest,
            browser: false,
        },

        parser: tsParser,
        ecmaVersion: 6,
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    settings: {
        react: {
            version: "detect",
        },

        "import/resolver": {
            node: {
                paths: ["src"],
            },
        },
    },

    rules: {
        "class-methods-use-this": "off",
        "no-console": "warn",

        "no-param-reassign": ["error", {
            props: false,
        }],

        "@typescript-eslint/no-unused-vars": ["warn", {
            argsIgnorePattern: "^_",
        }],

        "no-trailing-spaces": "error",
        "no-use-before-define": "off",

        "@typescript-eslint/no-use-before-define": ["error", {
            functions: false,
        }],

        "object-curly-newline": ["error", {
            multiline: true,
            consistent: true,
        }],

        "object-property-newline": ["error", {
            allowAllPropertiesOnSameLine: true,
        }],

        "react/jsx-first-prop-new-line": ["error", "multiline"],
        "react/jsx-indent": ["error", 2],
        "react/jsx-indent-props": ["error", 2],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
        "prettier/prettier": "error",
    },
}];