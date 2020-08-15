import { copyFile, ensureDir } from 'fs-extra'
import { resolve, dirname } from 'path'
import glob from 'fast-glob'
import { Plugin, OnDone, Payload } from '../interfaces'

type Rules = Array<{
  from: string
  to?: string
  context?: string
  ignore?: string[]
  transformPath?: (path: string) => string
}>

export class CopyAssetsPlugin implements Plugin {
  constructor(public rules: Rules) {}

  async onAfterRun(done: OnDone, { context, output }: Payload) {
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
    done()
  }
}

export function useCopyAssetsPlugin(rules: Rules): CopyAssetsPlugin {
  return new CopyAssetsPlugin(rules)
}
