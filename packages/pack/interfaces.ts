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
   * Output directory
   */
  output: string

  /**
   * Plugins list
   */
  plugins: Plugin[]
}

export type OnDone = () => void
export type Payload = { context: string; output: string }
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
