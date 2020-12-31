import { Command, flags } from '@oclif/command'
import { resolve } from 'path'
import { loadConfig } from '../loadConfig'
import { tryBuild } from '../build'

type Flags = { config: string; silent: boolean }

export default class Build extends Command {
  static description = 'Runs components build with defined plugins.'

  static flags = {
    config: flags.string({
      char: 'c',
      description: 'The path to a build config file.',
      default: 'build.config.js',
    }),
    silent: flags.boolean({
      description: 'Disable logs output.',
    }),
  }

  async run() {
    const { flags } = this.parse<Flags, any>(Build)
    const configs = await loadConfig(resolve(flags.config))
    for (const config of configs) {
      tryBuild({ ...config, silent: flags.silent || config.silent })
    }
  }
}
