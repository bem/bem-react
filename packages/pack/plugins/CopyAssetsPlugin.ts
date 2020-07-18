import { copyFile, ensureDir } from 'fs-extra'
import { resolve, dirname } from 'path'
import glob from 'fast-glob'

import { Plugin, OnDone, Payload } from '../interfaces'

type rules = Array<{
  from: string
  to: string
  transformPath?: (path: string) => string
}>

export class CopyAssetsPlugin implements Plugin {
  constructor(public rules: rules) {}

  async onAfterRun(done: OnDone, { context }: Payload) {
    for (const rule of this.rules) {
      const files = await glob(rule.from, { cwd: context })
      for (const file of files) {
        let destPath = resolve(context, rule.to, file)
        if (rule.transformPath !== undefined) {
          destPath = rule.transformPath(destPath)
        }
        await ensureDir(dirname(destPath))
        await copyFile(resolve(context, file), destPath)
      }
    }
    done()
  }
}
