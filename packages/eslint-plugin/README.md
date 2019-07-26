# @bem-react/eslint-plugin

Plugin for checking some things in projects based on [BEM React](https://github.com/bem/bem-react).

## Usage

Add `@bem-react` to the plugins section of your `.eslintrc` configuration file:

```json
{
    "plugins": [
        "@bem-react"
    ]
}
```

Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@bem-react/whitelist-levels-imports": ["error", {
            "defaultLevel": "common",
            "whiteList": {
                "common": ["common"],
                "desktop": ["common", "desktop"],
                "mobile": ["common", "mobile"]
            }
        }]
    }
}
```

## Supported Rules

Currently only one rule is supported:

* [whitelist-levels-imports](./docs/rules/whitelist-levels-imports.md)
