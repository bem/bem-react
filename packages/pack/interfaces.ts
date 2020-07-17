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

export interface Plugin {
  /**
   * Run hook before run
   */
  onBeforeRun?: (done: any) => Promise<void>

  /**
   * Run hook at run
   */
  onRun?: (done: any) => Promise<void>

  /**
   * Run hook after run
   */
  onAfterRun?: (done: any) => Promise<void>
}
