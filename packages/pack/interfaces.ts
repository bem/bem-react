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
