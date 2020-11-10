import { Command, flags } from '@oclif/command'
import { resolve } from 'path'
import { loadConfig } from '../loadConfig'
import { tryBuild } from '../build'

type Flags = { config: string }

export default class Build extends Command {
  static description = 'Runs components build with defined plugins.'

  static flags = {
    config: flags.string({
      char: 'c',
      description: 'The path to a build config file.',
      default: 'build.config.js',
    }),
  }

  async run() {
    const { flags } = this.parse<Flags, any>(Build)
    const config = await loadConfig(resolve(flags.config))

    tryBuild(config)
  }
}
