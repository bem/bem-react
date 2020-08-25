import { Config } from './interfaces'
import { log } from './log'

export function loadConfig(p: string): Config {
  try {
    const config = require(p)
    return config
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e
    }
    log.error(`Cannot load config by "${p}" path, please check path for correct.`)
    // TODO: Remove this, and make solution without throw.
    throw e
  }
}
