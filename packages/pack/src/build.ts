import { resolve } from 'path'
import c from 'chalk'

import { Config, HookOptions } from './interfaces'
import { wrapToPromise } from './wrapToPromise'
import { measurePerf } from './measurePerf'
import { States, renderProgressState } from './progress'
import { stdout } from './stdout'

const steps = ['onStart', 'onBeforeRun', 'onRun', 'onAfterRun', 'onFinish']

export async function tryBuild(config: Config): Promise<void> {
  config.context = config.context || process.cwd()
  const options: HookOptions = {
    context: config.context,
    output: resolve(config.context, config.output),
  }

  const errors = []
  const getTotalPerf = measurePerf()
  const state = createProgressState(config, steps)
  const disposeRender = renderProgressState(state, config.silent)

  process.on('SIGINT', async () => {
    disposeRender()

    // Run onAfterRun (cleanup) hook when process is interrupted.
    for (const plugin of config.plugins) {
      const hook = plugin.onAfterRun
      if (hook !== undefined) {
        await wrapToPromise(hook.bind(plugin), options)
      }
    }
  })

  stdout.plain(`${c.gray('[@bem-react/pack]')} Start building...`)
  for (const step of steps) {
    for (const plugin of config.plugins) {
      const hook = (plugin as any)[step]
      if (hook === undefined) {
        continue
      }
      const getStepPerf = measurePerf()
      state[plugin.name + step].state = States.running
      try {
        await wrapToPromise(hook.bind(plugin), options)
        state[plugin.name + step].state = States.done
      } catch (error) {
        errors.push(error)
        state[plugin.name + step].state = States.failed
      } finally {
        state[plugin.name + step].time = getStepPerf()
      }
    }
  }
  const time = getTotalPerf()
  disposeRender()
  if (errors.length > 0) {
    for (const error of errors) {
      stdout.error(c.red(error))
    }
    stdout.error(`${c.gray('[@bem-react/pack]')} ${c.red('Building failed!')} (${c.green(time)})`)
  } else {
    // prettier-ignore
    stdout.plain(`${c.gray('[@bem-react/pack]')} ${c.green('Building complete!')} (${c.green(time)})`)
  }
}

function createProgressState(config: Config, steps: string[]) {
  const state: Record<string, any> = {}
  for (const plugin of config.plugins) {
    for (const step of steps) {
      const hook = (plugin as any)[step]
      if (hook !== undefined) {
        state[plugin.name + step] = { step, name: plugin.name, state: States.inqueue, time: null }
      }
    }
  }
  return state
}
