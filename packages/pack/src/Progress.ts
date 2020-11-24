import Spinner from 'ora'

type Options = {
  steps: string[]
  name?: string
}

class Progress {
  private spinner: Spinner.Ora
  private steps: string[]
  private buildPrefix: string
  private hrstart: [number, number] = [0, 0]
  private hrend: [number, number] = [0, 0]

  constructor(options: Options) {
    this.steps = options.steps
    this.buildPrefix = options.name ? options.name + ': ' : ''
    this.spinner = Spinner(`0/${this.buildPrefix}${this.steps.length} Building...`)
  }

  start() {
    this.hrstart = process.hrtime()
    this.spinner.start()
  }

  finish() {
    this.hrend = process.hrtime(this.hrstart)
    this.spinner.succeed(`${this.buildPrefix}Components build was successful! (${this.hrend[0]}s)`)
  }

  update(step: string) {
    this.spinner.text = `${this.buildPrefix}${this.steps.indexOf(step) + 1}/${
      this.steps.length
    } Building...`
  }
}

export function createProgress(options: Options): Progress {
  return new Progress(options)
}
