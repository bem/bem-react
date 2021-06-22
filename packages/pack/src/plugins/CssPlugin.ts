import { resolve, dirname } from 'path'
import { ensureDir, readFile, writeFile, existsSync } from 'fs-extra'
import glob from 'fast-glob'
import postcss, { Processor } from 'postcss'

import { Plugin, OnDone, HookOptions } from '../interfaces'
import { mark } from '../debug'

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

class CssPlugin implements Plugin {
  name = 'CssPlugin'

  constructor(public options: Options) {
    mark('CssPlugin::constructor')
  }

  async onRun(done: OnDone, { context, output }: HookOptions) {
    mark('CssPlugin::onRun(start)')
    const ctx = this.options.context ? resolve(context, this.options.context) : context
    const processor = this.getCssProcessor(context)
    const files = await glob(this.options.src, { cwd: ctx, ignore: this.options.ignore })
    for (const file of files) {
      const filePath = resolve(ctx, file)
      const rawContent = await readFile(filePath, 'utf-8')
      const content = await this.runCssProcessorIfAvailable(rawContent, filePath, processor)
      const dirs = this.options.output ? this.options.output : [output]
      for (const dir of dirs) {
        const destPath = resolve(context, dir, file)
        await ensureDir(dirname(destPath))
        await writeFile(destPath, content)
      }
    }
    mark('CssPlugin::onRun(finish)')
    done()
  }

  private runCssProcessorIfAvailable(rawContent: string, filePath: string, processor?: Processor) {
    if (this.availableCssProcessor(processor)) {
      return processor.process(rawContent, { from: filePath, to: '' }).then((result) => result.css)
    }

    return Promise.resolve(rawContent)
  }

  private availableCssProcessor(_p?: Processor): _p is Processor {
    return this.options.postcssConfigPath !== undefined
  }

  private getCssProcessor(context: string): Processor | undefined {
    if (this.options.postcssConfigPath === undefined) {
      return undefined
    }
    const configPath = resolve(context, this.options.postcssConfigPath)
    if (!existsSync(configPath)) {
      throw new Error('Cannot find potcss config.')
    }
    const config = require(configPath)
    return postcss(config.plugins)
  }
}

export function useCssPlugin(options: Options): CssPlugin {
  return new CssPlugin(options)
}
