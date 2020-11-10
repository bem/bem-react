import { exec } from 'child_process'
import { promisify } from 'util'
import { resolve, join, dirname, relative } from 'path'
import { existsSync, writeJson } from 'fs-extra'
import glob from 'fast-glob'

import { Plugin, OnDone, HookOptions } from '../interfaces'
import { log } from '../log'
import { mark } from '../debug'

const execAsync = promisify(exec)

type Options = {
  /**
   * A path to typescript config.
   */
  configPath?: string

  /**
   * A callback for when creating side effects.
   */
  onCreateSideEffects: (path: string) => string[] | boolean | undefined
}

class TypeScriptPlugin implements Plugin {
  constructor(public options: Options = {} as Options) {
    mark('TypeScriptPlugin::constructor')
  }

  async onRun(done: OnDone, { context, output }: HookOptions) {
    mark('TypeScriptPlugin::onRun(start)')
    const configPath = this.getConfigPath(context)
    try {
      await Promise.all([
        execAsync(`npx tsc -p ${configPath} --module commonjs --outDir ${output}`),
        // prettier-ignore
        execAsync(`npx tsc -p ${configPath} --module esnext --outDir ${resolve(output, 'esm')}`),
      ])
    } catch (error) {
      log.error(error.stdout)
    }
    await this.generateModulePackage(output)
    mark('TypeScriptPlugin::onRun(finish)')
    done()
  }

  private getConfigPath(context: string): string {
    const configPath = resolve(context, this.options.configPath || 'tsconfig.json')
    if (!existsSync(configPath)) {
      throw new Error('Cannot find tsconfig.')
    }
    return configPath
  }

  // TODO: Move this logic to separate plugin.
  private async generateModulePackage(src: string): Promise<void> {
    const files = await glob('**/index.js', { cwd: src })
    for (const file of files) {
      const moduleDirname = dirname(file)
      const esmModuleDirname = dirname(join('esm', file))
      const packageJsonPath = resolve(src, moduleDirname, 'package.json')
      const json: { sideEffects: string[] | boolean; module?: string } = {
        sideEffects: ['*.css', '*@desktop.js', '*@touch-phone.js', '*@touch-pad.js'],
      }

      if (this.options.onCreateSideEffects !== undefined) {
        const sideEffects = this.options.onCreateSideEffects(file)
        if (sideEffects !== undefined) {
          json.sideEffects = sideEffects
        }
      }

      if (file.match(/^esm/) === null) {
        json.module = join(relative(moduleDirname, esmModuleDirname), 'index.js')
      }

      await writeJson(packageJsonPath, json, { spaces: 2 })
    }
  }
}

export function useTypeScriptPlugin(options: Options): TypeScriptPlugin {
  return new TypeScriptPlugin(options)
}
