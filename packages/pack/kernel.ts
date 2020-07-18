import { Config } from './interfaces'
import { wrapToPromise } from './wrapToPromise'

const steps = ['onBeforeRun', 'onRun', 'onAfterRun']

export async function tryRun(config: Config): Promise<void> {
  for (const step of steps) {
    const calls = []
    for (const plugin of config.plugins) {
      const hook = (plugin as any)[step]
      if (hook !== undefined) {
        calls.push(wrapToPromise(hook.bind(plugin)))
      }
    }
    await Promise.all(calls)
  }
}
