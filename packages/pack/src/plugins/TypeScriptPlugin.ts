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
  configPath?: string
}

class TypeScriptPlugin implements Plugin {
  constructor(public options: Options) {
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

  private async generateModulePackage(src: string): Promise<void> {
    const files = await glob('**/index.js', { cwd: src, ignore: ['esm/**/index.js'] })
    for (const file of files) {
      const moduleDirname = dirname(file)
      const esmModuleDirname = dirname(join('esm', file))
      const packageJsonPath = resolve(src, moduleDirname, 'package.json')

      await writeJson(packageJsonPath, {
        module: join(relative(moduleDirname, esmModuleDirname), 'index.js'),
        sideEffects: ['.css'],
      })
    }
  }
}

export function useTypeScriptPlugin(options: Options): TypeScriptPlugin {
  return new TypeScriptPlugin(options)
}
