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
export type Payload = { context: string }
export type HookFn = (done: OnDone, payload: Payload) => Promise<void>

export interface Plugin {
  /**
   * Run hook before run
   */
  onBeforeRun?: HookFn

  /**
   * Run hook at run
   */
  onRun?: HookFn

  /**
   * Run hook after run
   */
  onAfterRun?: HookFn
}
