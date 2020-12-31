export type Config = {
  /**
   * Disable logs output.
   */
  silent?: boolean

  /**
   * Executing context.
   *
   * @default cwd
   */
  context?: string

  /**
   * Output directory.
   */
  output: string

  /**
   * Plugins list.
   */
  plugins: Plugin[]
  /**
   * Config name
   */
  name?: string
}

export type OnDone = () => void
export type HookOptions = { context: string; output: string }
export type HookFn = (done: OnDone, options: HookOptions) => Promise<void>

export interface Plugin {
  /**
   * A plugin name.
   */
  name: string

  /**
   * Run hook at start.
   */
  onStart?: HookFn

  /**
   * Run hook before run.
   */
  onBeforeRun?: HookFn

  /**
   * Run hook at run.
   */
  onRun?: HookFn

  /**
   * Run hook after run.
   */
  onAfterRun?: HookFn

  /**
   * Run hook at finish.
   */
  onFinish?: HookFn
}
