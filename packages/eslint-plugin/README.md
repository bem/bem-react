# @bem-react/eslint-plugin &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/eslint-plugin.svg)](https://www.npmjs.com/package/@bem-react/eslint-plugin)

Plugin for checking some things in projects based on [BEM React](https://github.com/bem/bem-react).

## Usage

Add `@bem-react` to the plugins section of your `.eslintrc` configuration file:

```json
{
  "plugins": ["@bem-react"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@bem-react/no-classname-runtime": "warn",
    "@bem-react/whitelist-levels-imports": [
      "error",
      {
        "defaultLevel": "common",
        "whiteList": {
          "common": ["common"],
          "desktop": ["common", "desktop"],
          "mobile": ["common", "mobile"]
        }
      }
    ]
  }
}
```

## Supported Rules

Currently is supported:

- [whitelist-levels-imports](./docs/rules/whitelist-levels-imports.md)
- [no-classname-runtime](./docs/rules/no-classname-runtime.md)
