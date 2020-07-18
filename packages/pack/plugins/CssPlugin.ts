import { resolve, dirname } from 'path'
import { ensureDir, readFile, writeFile } from 'fs-extra'
import glob from 'fast-glob'
import postcss, { Processor, Plugin as PostcssPlugin } from 'postcss'

import { Plugin, OnDone, Payload } from '../interfaces'

type PostcssConfig = {
  plugins: PostcssPlugin<any>[]
}

type Options = {
  src: string
  postcss?: string | PostcssConfig
}

class CssPlugin implements Plugin {
  constructor(public options: Options) {}

  async onRun(done: OnDone, { context, output }: Payload) {
    const processor = this.getCssProcessor()
    const files = await glob(this.options.src, { cwd: context })
    for (const file of files) {
      const rawContent = await readFile(resolve(context, file), 'utf-8')
      const content = this.availableCssProcessor(processor)
        ? processor.process(rawContent, { from: '', to: '' })
        : rawContent
      await ensureDir(dirname(resolve(output, file)))
      await writeFile(resolve(output, file), content)
    }
    done()
  }

  private availableCssProcessor(_processor: Processor): _processor is Processor {
    return this.options.postcss !== undefined
  }

  // @ts-ignore
  private getCssProcessor(): Processor {
    if (this.options.postcss !== undefined) {
      // eslint-disable-next-line operator-linebreak
      const postcssConfig: PostcssConfig =
        typeof this.options.postcss === 'string'
          ? require(this.options.postcss)
          : this.options.postcss
      return postcss(postcssConfig.plugins)
    }
  }
}

export function useCssPlugin(options: Options): CssPlugin {
  return new CssPlugin(options)
}
