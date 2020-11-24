import { Config } from './interfaces'
import { log } from './log'

function normalizeConfig(config: Config): Config[] {
  return Array.isArray(config) ? config : [config]
}

export function loadConfig(p: string): Config[] {
  try {
    const configs = normalizeConfig(require(p))

    return configs
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
    log.error(`Cannot load config by "${p}" path, please check path for correct.`)
    // TODO: Remove this, and make solution without throw.
    throw e
  }
}
