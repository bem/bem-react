import { resolve } from 'path'

import { Config, HookOptions } from './interfaces'
import { wrapToPromise } from './wrapToPromise'
import { createPgoress } from './Progress'

const steps = ['onStart', 'onBeforeRun', 'onRun', 'onAfterRun', 'onFinish']

export async function tryBuild(config: Config): Promise<void> {
  config.context = config.context || process.cwd()
  const options: HookOptions = {
    context: config.context,
    output: resolve(config.context, config.output),
  }

  const progress = createPgoress({ steps })

  // TODO: Catch errors from plugins and stop progress with message.
  progress.start()
  for (const step of steps) {
    const calls = []
    progress.update(step)
    for (const plugin of config.plugins) {
      const hook = (plugin as any)[step]
      if (hook !== undefined) {
        calls.push(wrapToPromise(hook.bind(plugin), options))
      }
    }
    await Promise.all(calls)
  }
  progress.finish()
}
