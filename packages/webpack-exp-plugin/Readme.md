# Webpack-exp-plugin

Example - all components:

```js
const webpackExpPlugin = require('@bem-react/webpack-exp-plugin')

module.exports = {
  entry: './src/index.js',
  output: './dist',
  plugins: [new webpackExpPlugin('@yandex/ui', { '*': 'css-modules-exp' })],
}
```

Example - Button only:

```js
const webpackExpPlugin = require('@bem-react/webpack-exp-plugin')

module.exports = {
  entry: './src/index.js',
  output: './dist',
  plugins: [new webpackExpPlugin('@yandex/ui', { Button: 'new-button-exp' })],
}
```

Example - Button and Select:

```js
const webpackExpPlugin = require('@bem-react/webpack-exp-plugin')

module.exports = {
  entry: './src/index.js',
  output: './dist',
  plugins: [
    new webpackExpPlugin('@yandex/ui', { Button: 'new-button-exp', Select: 'better-select-exp' }),
  ],
}
```
