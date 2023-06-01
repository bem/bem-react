import { exec } from 'child_process'
import { promisify } from 'util'
import { resolve } from 'path'
import { existsSync } from 'fs-extra'

import { Plugin, OnDone, HookOptions } from '../interfaces'
import { mark } from '../debug'

const execAsync = promisify(exec)

type Options = {
  /**
   * A path to typescript config.
   */
  configPath?: string
}

class TypeScriptResolvePlugin implements Plugin {
  name = 'TypescriptResolvePlugin'

  constructor(public options: Options = {} as Options) {
    mark('TypescriptResolvePlugin::constructor')
  }

  async onAfterRun(done: OnDone, { context }: HookOptions) {
    mark('TypescriptResolvePlugin::onRun(start)')
    const configPath = this.getConfigPath(context)

    try {
      await execAsync(`tsc-alias -p ${configPath}`)
    } catch (error) {
      throw new Error((error as any).stdout)
    }

    mark('TypescriptResolvePlugin::onRun(finish)')
    done()
  }

  private getConfigPath(context: string) {
    const configPath = resolve(context, this.options.configPath || 'tsconfig.json')

    if (!existsSync(configPath)) {
      throw new Error('Cannot find tsconfig.')
    }

    return configPath
  }
}

export function useTypeScriptResolvePlugin(options: Options) {
  return new TypeScriptResolvePlugin(options)
}
