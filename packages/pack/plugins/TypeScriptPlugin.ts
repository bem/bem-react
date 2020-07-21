import { exec } from 'child_process'
import { promisify } from 'util'
import { resolve, join, dirname, relative } from 'path'
import { existsSync, writeJson } from 'fs-extra'
import glob from 'fast-glob'

import { Plugin, OnDone, Payload } from '../interfaces'

const execAsync = promisify(exec)

type Options = {
  configPath?: string
}

class TypeScriptPlugin implements Plugin {
  constructor(public options: Options) {}

  async onRun(done: OnDone, { output }: Payload) {
    const configPath = this.getConfigPath()

    await Promise.all([
      execAsync(`npx tsc -p ${configPath} --module commonjs --outDir ${output}`),
      // prettier-ignore
      execAsync(`npx tsc -p ${configPath} --module esnext --outDir ${resolve(output, 'esm')}`),
    ])

    await this.generateModulePackage(output)

    done()
  }

  private getConfigPath(): string {
    let configPath = this.options.configPath

    if (this.options.configPath === undefined) {
      const rootTsConfig = resolve(process.cwd(), 'tsconfig.json')
      if (existsSync(rootTsConfig)) {
        configPath = rootTsConfig
      }
      throw new Error('Cannot find tsconfig.')
    }

    return configPath as string
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
