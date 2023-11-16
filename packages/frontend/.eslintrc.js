module.exports = {
	"env": {
		"browser": true,
		"es2021": true
	},
	"extends": [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react/recommended"
	],
	"overrides": [
		{
			"env": {
				"node": true
			},
			"files": [
				".eslintrc.{js,cjs}"
			],
			"parserOptions": {
				"sourceType": "script"
			}
		}
	],
	"parser": "@typescript-eslint/parser",
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"plugins": [
		"@typescript-eslint",
		"react"
	],
	"ignorePatterns": ["*.json","*.ico", "*.png","*.css","*.mdx","*.svg"],
	"rules": {
		"@typescript-eslint/no-explicit-any": "off",
		"react/react-in-jsx-scope": "off",
		"react/jsx-filename-extension": [1, { "extensions": [".tsx"] }],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		],
		"no-unused-vars": ["error", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
	}
};
