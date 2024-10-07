import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { fixupPluginRules } from "@eslint/compat";
import prettierCfg from "eslint-config-prettier";
import pluginImport from "eslint-plugin-import";

const makeImportConfig = project => ({
	plugins: { import: fixupPluginRules({ rules: pluginImport.rules }) },
	settings: {
		"import/resolver": { node: true, typescript: { project } }
	},
	// https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
	rules: {
		"import/consistent-type-specifier-style": ["warn", "prefer-top-level"],
		"import/first": "error",
		"import/no-anonymous-default-export": "warn"
	}
});

const files = ["**/*.{ts,tsx}"];

export default tseslint.config(
	{ ignores: ["dist"] },
	{ ...js.configs.recommended, files },
	...tseslint.configs.recommended.map(cfg => ({ ...cfg, files })),
	{
		files,
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: "module",
			globals: globals.es2020,
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},
		rules: {
			"@typescript-eslint/consistent-type-exports": "warn",
			"@typescript-eslint/consistent-type-imports": "warn",
			"@typescript-eslint/no-explicit-any": "off",
			"@typescript-eslint/no-non-null-assertion": "off",
			"@typescript-eslint/no-require-imports": "error",
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{ args: "none", caughtErrors: "none", ignoreRestSiblings: true }
			]
		}
	},
	/* ===-===-=== React Linting ===-===-=== */
	{
		files,
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
			parserOptions: { ecmaFeatures: { jsx: true, jsxPragma: null } }
		},
		plugins: {
			react,
			"react-hooks": fixupPluginRules(reactHooks),
			"react-refresh": reactRefresh
		},
		settings: { react: { version: "detect" } },
		rules: {
			...react.configs.recommended.rules,
			...react.configs["jsx-runtime"].rules,
			...reactHooks.configs.recommended.rules,
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true }
			],

			// Overzealous, and doesn't work with typescript
			"react/prop-types": "off"
		}
	},
	{ files, ...makeImportConfig("./tsconfig.app.json") },
	{ ...prettierCfg, files }
);
