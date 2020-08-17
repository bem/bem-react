import { copyFile, ensureDir } from 'fs-extra'
import { resolve, dirname } from 'path'
import glob from 'fast-glob'
import { Plugin, OnDone, HookOptions } from '../interfaces'
import { mark } from '../debug'

type Rule = {
  src: string
  context?: string
  output: string[]
  ignore?: string[]
}
type Rules = Array<Rule> | Rule

export class CopyAssetsPlugin implements Plugin {
  constructor(public rules: Rules) {
    mark('CopyAssetsPlugin::constructor')
  }

  async onAfterRun(done: OnDone, { context, output }: HookOptions) {
    mark('CopyAssetsPlugin::onAfterRun(start)')
    const rules = Array.isArray(this.rules) ? this.rules : [this.rules]
    for (const rule of rules) {
      const ctx = rule.context ? resolve(context, rule.context) : context
      const files = await glob(rule.src, { cwd: ctx, ignore: rule.ignore })
      for (const file of files) {
        const dirs = rule.output ? rule.output : [output]
        for (const dir of dirs) {
          const destPath = resolve(context, dir, file)
          await ensureDir(dirname(destPath))
          await copyFile(resolve(ctx, file), destPath)
        }
      }
    }
    mark('CopyAssetsPlugin::onAfterRun(finish)')
    done()
  }
}

export function useCopyAssetsPlugin(rules: Rules): CopyAssetsPlugin {
  return new CopyAssetsPlugin(rules)
}
