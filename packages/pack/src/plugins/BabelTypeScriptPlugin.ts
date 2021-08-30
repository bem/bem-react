import { exec } from 'child_process'
import { promisify } from 'util'
import { resolve, join, dirname, relative } from 'path'
import { writeJson } from 'fs-extra'
import glob from 'fast-glob'
import ts from 'typescript'
import { removeSync, writeJSONSync } from 'fs-extra'

import { Plugin, OnDone, HookOptions } from '../interfaces'
import { mark } from '../debug'

const execAsync = promisify(exec)

type Options = {
  /**
   * A path to typescript config.
   */
  tsConfigPath?: string
  /**
   * A path to babel config.
   */
  babelConfigPath?: string
  /**
   * A callback for when creating side effects.
   */
  onCreateSideEffects: (path: string) => string[] | boolean | undefined
}

class BabelTypeScriptPlugin implements Plugin {
  name = 'BabelTypeScriptPlugin'

  private context = ''
  private output = ''
  private precompiledConfigPath = ''
  private precompiledDir = ''

  constructor(public options: Options = {} as Options) {
    mark('BabelTypeScriptPlugin::constructor')
  }

  async onStart(done: OnDone, { context, output }: HookOptions) {
    this.options.tsConfigPath = this.options.tsConfigPath || 'tsconfig.json'
    this.options.babelConfigPath = this.options.babelConfigPath || 'babel.config.js'

    this.precompiledDir = '__precompiled__'
    this.precompiledConfigPath = join(context, 'tsconfig.__precompiled__.json')
    this.context = context
    this.output = output
    done()
  }

  async onBeforeRun(done: OnDone) {
    this.generatePrecompiledTsConfig()
    done()
  }

  async onRun(done: OnDone) {
    mark('BabelTypeScriptPlugin::onRun(start)')

    try {
      await this.generateTypings()
      await this.compile()
      await this.generateModulePackage()
    } catch (error) {
      throw new Error(error.stdout || error.stderr)
    }

    mark('BabelTypeScriptPlugin::onRun(finish)')
    done()
  }

  async onAfterRun(done: OnDone) {
    removeSync(this.precompiledConfigPath)
    removeSync(this.precompiledDir)
    done()
  }

  private async compile() {
    const babelConfigPath = this.options.babelConfigPath
    const precompiledOutDir = this.precompiledDir
    const tsConfigPath = this.precompiledConfigPath
    const config = this.getTsConfig()
    const { rootDir, outDir } = config.options

    // prettier-ignore
    await execAsync(`npx babel ${rootDir} --config-file ${babelConfigPath} --out-dir ${precompiledOutDir} --extensions .ts,.tsx`)
    await Promise.all([
      // prettier-ignore
      execAsync(`npx tsc -p ${tsConfigPath} --module commonjs --outDir ${outDir!}`),
      // prettier-ignore
      execAsync(`npx tsc -p ${tsConfigPath} --module esnext --outDir ${resolve(outDir!, 'esm')}`),
    ])
  }

  private async generateTypings() {
    mark('BabelTypeScriptPlugin::generateTypings')
    const configPath = this.getTsConfigPath()

    await execAsync(`npx tsc -p ${configPath} --emitDeclarationOnly`)
  }

  private generatePrecompiledTsConfig() {
    mark('BabelTypeScriptPlugin::generatePrecompiledTsConfig')

    const config = this.getTsConfig()

    if (!config.options.rootDir || !config.options.baseUrl) {
      throw new Error('A rootDir or baseUrl not defined for tsconfig.')
    }

    const rootDir = relative(config.options.baseUrl, config.options.rootDir)

    const precompiledConfig = {
      extends: this.options.tsConfigPath,
      compilerOptions: {
        paths: {},
        rootDir: this.precompiledDir,
        allowJs: true,
        declaration: false,
      },
      include: config.raw.include.map((path: string) => path.replace(rootDir, this.precompiledDir)),
      exclude: config.raw.exclude.map((path: string) => path.replace(rootDir, this.precompiledDir)),
    }

    writeJSONSync(this.precompiledConfigPath, precompiledConfig, { spaces: 2 })
  }

  private getTsConfigPath() {
    const configName = this.options.tsConfigPath
    const configPath = ts.findConfigFile(this.context, ts.sys.fileExists, configName) as string

    if (!configPath) {
      throw new Error('Cannot find tsconfig, please check path.')
    }

    return configPath
  }

  private getTsConfig() {
    const configPath = this.getTsConfigPath()
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile)
    const compilerOptions = ts.parseJsonConfigFileContent(configFile.config, ts.sys, this.context)

    return compilerOptions
  }

  // TODO: Move this logic to separate plugin.
  private async generateModulePackage(): Promise<void> {
    const src = this.output
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

export function useBabelTypeScriptPlugin(options: Options): BabelTypeScriptPlugin {
  return new BabelTypeScriptPlugin(options)
}
