import { create as createRenderer } from 'log-update'
import c from 'chalk'

export const enum States {
  inqueue = 'INQUEUE',
  running = 'RUNNING',
  done = 'DONE',
  failed = 'FAILED',
}

// TODO: Disable keypress from stdin.
export function renderProgressState(state: State, silent: boolean = false): () => void {
  if (silent) {
    return () => {}
  }

  function renderFn() {
    updateProgressFrame(state)
    renderLog(createStateView(state))
  }

  const intervalRef = setInterval(renderFn, 125)

  return () => {
    clearInterval(intervalRef)
    renderFn()
  }
}

const renderLog = createRenderer(process.stdout, { showCursor: true })

type State = Record<
  string,
  {
    name: string
    step: string
    state: string
    value: string
    time: string | null
    frame: string
  }
>

const stateColors: Record<string, string> = {
  [States.inqueue]: 'gray',
  [States.running]: 'yellow',
  [States.done]: 'green',
  [States.failed]: 'red',
}

function createSeparator(state: State) {
  const values = []
  for (const [_, value] of Object.entries(state)) {
    values.push((value.name + value.step + '....').length)
  }
  const maxValue = Math.max(...values)
  return (a: string, b: string) => {
    return '.'.repeat(maxValue - (a + b).length)
  }
}

function createStateView(state: State): string {
  const sep = createSeparator(state)
  const result = []
  for (const [_, value] of Object.entries(state)) {
    const message = [
      `${c.gray('[@bem-react/pack]')}`,
      `${c.cyan(value.name)}:${value.step}`,
      `${c.gray(sep(value.name, value.step))}`,
      `[${(c as any)[stateColors[value.state]](value.state)}]`,
    ]

    if (value.state !== 'INQUEUE') {
      message.push(`${c.gray(`(${value.time ? value.time : value.frame})`)}`)
    }

    result.push(message.join(' '))
  }
  return result.join('\n')
}

function createProgressFrame() {
  let i = 0
  const frames = ['∙∙∙', '●∙∙', '∙●∙', '∙∙●', '∙∙∙']
  return () => frames[++i % frames.length]
}

const getNextFrame = createProgressFrame()

function updateProgressFrame(state: State): void {
  for (const [_, value] of Object.entries(state)) {
    value.frame = getNextFrame()
  }
}
