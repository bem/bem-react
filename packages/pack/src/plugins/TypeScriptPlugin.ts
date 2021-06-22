import { exec } from 'child_process'
import { promisify } from 'util'
import { resolve, join, dirname, relative } from 'path'
import { existsSync, writeJson, readFile, writeFile } from 'fs-extra'
import glob from 'fast-glob'

import { Plugin, OnDone, HookOptions } from '../interfaces'
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

  /**
   * A map whose keys must be replaced for values.
   */
  replace?: Record<string, string>

  /**
   * A path to esm output directory
   */
  esmOutput?: string
}

class TypeScriptPlugin implements Plugin {
  name = 'TypeScriptPlugin'
  private typescriptResult: { stdout: string }[] = []

  constructor(public options: Options = {} as Options) {
    mark('TypeScriptPlugin::constructor')
  }

  async onRun(done: OnDone, { context, output }: HookOptions) {
    mark('TypeScriptPlugin::onRun(start)')
    const configPath = this.getConfigPath(context)
    const esmOutput = this.options.esmOutput || resolve(output, 'esm')
    try {
      this.typescriptResult = await Promise.all([
        // prettier-ignore
        execAsync(`npx tsc -p ${configPath} --listEmittedFiles --module commonjs --outDir ${output}`),
        // prettier-ignore
        execAsync(`npx tsc -p ${configPath} --listEmittedFiles --module esnext --outDir ${esmOutput}`),
      ])
    } catch (error) {
      throw new Error(error.stdout)
    }
    await this.generateModulePackage(output)
    mark('TypeScriptPlugin::onRun(finish)')
    done()
  }

  async onAfterRun(done: OnDone) {
    if (this.options.replace !== undefined) {
      const [cjs, esm] = this.typescriptResult
      this.replace(cjs.stdout)
      this.replace(esm.stdout)
    }
    done()
  }

  private async replace(rawFiles: string): Promise<void> {
    // Remove artifacts from tsc stdout.
    const files = rawFiles
      .split(/\n/)
      .map((x) => x.replace(/^TSFILE:\s/, ''))
      .filter(Boolean)
    for (const file of files) {
      let content = await readFile(file, 'utf-8')
      for (const key in this.options.replace) {
        const needleRe = new RegExp(key, 'g')
        content = content.replace(needleRe, this.options.replace[key])
      }
      // TODO: Maybe optimized — don't rewrite file if nothing replaced.
      await writeFile(file, content)
    }
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
    const files = await glob('**/index.js', { cwd: src, ignore: [`${src}/esm/`] })
    const esmOutput = this.options.esmOutput || 'esm'
    for (const file of files) {
      const moduleDirname = dirname(join(src, file))
      const esmModuleDirname = dirname(join(esmOutput, file))
      const packageJsonPath = resolve(src, moduleDirname, 'package.json')
      const esmPackageJsonPath = resolve(src, esmModuleDirname, 'package.json')
      const json: { sideEffects: string[] | boolean; module?: string } = {
        sideEffects: ['*.css', '*@desktop.js', '*@touch-phone.js', '*@touch-pad.js'],
      }

      if (this.options.onCreateSideEffects !== undefined) {
        const sideEffects = this.options.onCreateSideEffects(file)
        if (sideEffects !== undefined) {
          json.sideEffects = sideEffects
        }
      }

      await writeJson(esmPackageJsonPath, json, { spaces: 2 })

      json.module = join(relative(moduleDirname, esmModuleDirname), 'index.js')

      await writeJson(packageJsonPath, json, { spaces: 2 })
    }
  }
}

export function useTypeScriptPlugin(options: Options): TypeScriptPlugin {
  return new TypeScriptPlugin(options)
}
