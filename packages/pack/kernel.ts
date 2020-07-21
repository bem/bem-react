import { resolve } from 'path'

import { Config, Payload } from './interfaces'
import { wrapToPromise } from './wrapToPromise'

const root = process.cwd()
const steps = ['onBeforeRun', 'onRun', 'onAfterRun']

export async function tryRun(config: Config): Promise<void> {
  config.context = config.context || root
  const payload: Payload = {
    context: resolve(root, config.context),
    output: resolve(root, config.output),
  }

  for (const step of steps) {
    const calls = []
    for (const plugin of config.plugins) {
      const hook = (plugin as any)[step]
      if (hook !== undefined) {
        calls.push(wrapToPromise(hook.bind(plugin), payload))
      }
    }
    await Promise.all(calls)
  }
}
