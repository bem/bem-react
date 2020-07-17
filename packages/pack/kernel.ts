import { Config } from './interfaces'

const steps = ['init', 'onBeforeRun', 'onRun', 'onAfterRun']

export async function tryRun(config: Config): Promise<void> {
  const _config = config

  for (const step of steps) {
    console.log(step)
  }
}
