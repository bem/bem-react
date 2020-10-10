# @bem-react/pack &middot; [![npm (scoped)](https://img.shields.io/npm/v/@bem-react/pack.svg)](https://www.npmjs.com/package/@bem-react/pack)

A tool for building and prepare components for publishing.

## ✈️ Install

via npm:

```sh
npm i -DE @bem-react/pack
```

via yarn:

```sh
yarn add -D @bem-react/pack
```

## ☄️ Usage

```sh
Runs components build with defined plugins.

USAGE
  $ pack build

OPTIONS
  -c, --config=config  [default: build.config.json] The path to a build config file.
```

## ⚙️ Configuration

An example configuration:

```js
const { resolve } = require('path')
const { useCleanUpPlugin } = require('@bem-react/pack/lib/plugins/CleanUpPlugin')
const { useCopyAssetsPlugin } = require('@bem-react/pack/lib/plugins/CopyAssetsPlugin')
const { useCssPlugin } = require('@bem-react/pack/lib/plugins/CssPlugin')
const { useTypeScriptPlugin } = require('@bem-react/pack/lib/plugins/TypescriptPlugin')

/**
 * @type {import('@bem-react/pack/lib/interfaces').Config}
 */
module.exports = {
  context: resolve(__dirname, '..'),

  output: './dist',

  plugins: [
    useCleanUpPlugin(['./dist']),

    useTypeScriptPlugin({
      configPath: './tsconfig.prod.json',
    }),

    useCssPlugin({
      context: './src',
      src: './**/*.css',
      output: ['./dist', './dist/esm'],
    }),

    useCopyAssetsPlugin([
      {
        context: './src',
        src: './**/*.{svg,md,json}',
        output: ['./dist', './dist/esm'],
      },
    ]),
  ],
}
```

### Declaration

```ts
type Config = {
  /**
   * Executing context.
   *
   * @default cwd
   */
  context?: string

  /**
   * Output directory.
   */
  output: string

  /**
   * Plugins list.
   */
  plugins: Plugin[]
}
```

## 🛠 Plugins

### CleanUpPlugin

Plugin for cleanuping directories. _(Run at `beforeRun` step)._

#### Usage

```js
const { useCleanUpPlugin } = require('@bem-react/pack/lib/plugins/CleanUpPlugin')

useCleanUpPlugin(['./dist'])
```

#### Declaration

```ts
/**
 * A list of directories which need to be cleaned.
 */
type Sources = string[]

export declare function useCleanUpPlugin(sources: Sources): CleanUpPlugin
```

### CopyAssetsPlugin

Plugin for copying assets. _(Run at `afterRun` step)._

#### Usage

```js
const { useCopyAssetsPlugin } = require('@bem-react/pack/lib/plugins/CopyAssetsPlugin')

useCopyAssetsPlugin([
  {
    context: './src',
    src: './**/*.{svg,md,json}',
    output: ['./dist', './dist/esm'],
  },
])
```

#### Declaration

```ts
type Rule = {
  /**
   * Glob or path from where we сopy files.
   */
  src: string

  /**
   * Output paths.
   */
  output: string[]

  /**
   * A path that determines how to interpret the `src` path.
   */
  context?: string

  /**
   * Paths to files that will be ignored when copying.
   */
  ignore?: string[]
}

type Rules = Rule | Rule[]

function useCopyAssetsPlugin(rules: Rules): CopyAssetsPlugin
```

### CssPlugin

A plugin that copies css files and makes processing using postcss on demand. _(Run at `run` step)._

#### Usage

```js
const { useCssPlugin } = require('@bem-react/pack/lib/plugins/CssPlugin')

useCssPlugin({
  context: './src',
  src: './**/*.css',
})
```

#### Declaration

```ts
type Options = {
  /**
   * A path that determines how to interpret the `src` path.
   */
  context?: string
  /**
   * Glob or path from where we сopy files.
   */
  src: string
  /**
   * Output paths.
   */
  output: string[]
  /**
   * Paths to files that will be ignored when copying and processing.
   */
  ignore?: string[]
  /**
   * A path to postcss config.
   */
  postcssConfigPath?: string
}

export declare function useCssPlugin(options: Options): CssPlugin
```

### TypescriptPlugin

A plugin that process ts and creates two copies of the build (cjs and esm). _(Run at `run` step)._

#### Usage

```js
const { useTypeScriptPlugin } = require('@bem-react/pack/lib/plugins/TypescriptPlugin')

useTypeScriptPlugin({
  configPath: './tsconfig.prod.json',
})
```

#### Declaration

```ts
type Options = {
  /**
   * A path to typescript config.
   */
  configPath?: string
}

function useTypeScriptPlugin(options: Options): TypeScriptPlugin
```

## 🏗 Write own plugin

The plugin can perform an action on one of the available hook `onBeforeRun`, `onRun` and `onAfterRun`.

### Example

```ts
import { Plugin, OnDone, HookOptions } from '@bem-raect/pack/lib/interfaces'

class MyPlugin implements Plugin {
  async onRun(done: OnDone, { context, output }: HookOptions) {
    // Do something stuff.
    done()
  }
}

export function useMyPlugin(): MyPlugin {
  return new CssPlugin()
}
```

### Declaration

```ts
type OnDone = () => void
type HookOptions = { context: string; output: string }
type HookFn = (done: OnDone, options: HookOptions) => Promise<void>

interface Plugin {
  /**
   * Run hook at start.
   */
  onStart?: HookFn

  /**
   * Run hook before run.
   */
  onBeforeRun?: HookFn

  /**
   * Run hook at run.
   */
  onRun?: HookFn

  /**
   * Run hook after run.
   */
  onAfterRun?: HookFn

  /**
   * Run hook at finish.
   */
  onFinish?: HookFn
}
```
