import Spinner from 'ora'

type Options = {
  steps: string[]
}

class Pgoress {
  private spinner: Spinner.Ora
  private steps: string[]
  private hrstart: [number, number] = [0, 0]
  private hrend: [number, number] = [0, 0]

  constructor(options: Options) {
    this.steps = options.steps
    this.spinner = Spinner(`0/${this.steps.length} Building...`)
  }

  start() {
    this.hrstart = process.hrtime()
    this.spinner.start()
  }

  finish() {
    this.hrend = process.hrtime(this.hrstart)
    this.spinner.succeed(`Components build was successful! (${this.hrend[0]}s)`)
  }

  update(step: string) {
    this.spinner.text = `${this.steps.indexOf(step) + 1}/${this.steps.length} Building...`
  }
}

export function createPgoress(options: Options): Pgoress {
  return new Pgoress(options)
}
