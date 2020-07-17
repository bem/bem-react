export type Module = {
  src: string
  use: any[]
}

export type Config = {
  /**
   * Executing context
   *
   * @default cwd
   */
  context?: string

  /**
   * Modules list
   */
  modules: Module[]

  /**
   * Plugins list
   */
  plugins: Plugin[]
}

export type OnDone = () => void

export interface Plugin {
  /**
   * Run hook before run
   */
  onBeforeRun?: (done: OnDone) => Promise<void>

  /**
   * Run hook at run
   */
  onRun?: (done: OnDone) => Promise<void>

  /**
   * Run hook after run
   */
  onAfterRun?: (done: OnDone) => Promise<void>
}
