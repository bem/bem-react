import { copyFile, ensureDir } from 'fs-extra'
import { resolve, dirname } from 'path'
import glob from 'fast-glob'
import { Plugin, OnDone, HookOptions } from '../interfaces'
import { mark } from '../debug'

type Rules = Array<{
  from: string
  to?: string
  context?: string
  ignore?: string[]
  transformPath?: (path: string) => string
}>

export class CopyAssetsPlugin implements Plugin {
  constructor(public rules: Rules) {
    mark('CopyAssetsPlugin::constructor')
  }

  async onAfterRun(done: OnDone, { context, output }: HookOptions) {
    mark('CopyAssetsPlugin::onAfterRun(start)')
    for (const rule of this.rules) {
      const ctx = rule.context ? resolve(context, rule.context) : context
      const files = await glob(rule.from, { cwd: ctx, ignore: rule.ignore })
      for (const file of files) {
        let destPath = resolve(ctx, rule.to || output, file)
        if (rule.transformPath !== undefined) {
          destPath = rule.transformPath(destPath)
        }
        await ensureDir(dirname(destPath))
        await copyFile(resolve(ctx, file), destPath)
      }
    }
    mark('CopyAssetsPlugin::onAfterRun(finish)')
    done()
  }
}

export function useCopyAssetsPlugin(rules: Rules): CopyAssetsPlugin {
  return new CopyAssetsPlugin(rules)
}
