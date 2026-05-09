// @ts-check

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig(
	{
		ignores: [
			'**/node_modules/**',
			'**/dist/**',
			'**/coverage/**',
			'**/.next/**',
			'**/generated/**',
		],
	},

	{
		files: ['**/*.{ts,tsx}'],
		extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2023,
			},
			parserOptions: {
				tsconfigRootDir,
				projectService: true,
			},
		},
		rules: {
			'no-undef': 'off',

			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-floating-promises': 'warn',
			'@typescript-eslint/no-misused-promises': 'warn',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
		},
	},

	{
		files: ['**/*.{js,mjs,cjs}'],
		extends: [js.configs.recommended, tseslint.configs.disableTypeChecked],
		languageOptions: {
			ecmaVersion: 2023,
			sourceType: 'module',
			globals: {
				...globals.node,
				...globals.es2023,
			},
		},
	},

	eslintPluginPrettierRecommended,
	{
		rules: {
			'prettier/prettier': [
				'error',
				{
					singleQuote: true,
					trailingComma: 'all',
					tabWidth: 4,
					useTabs: true,
					semi: true,
					endOfLine: 'lf',
					printWidth: 100,
				},
			],
		},
	},
);
