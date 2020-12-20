import path from 'path'
import webpack, { WebpackPluginInstance } from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

type Options = {
  plugins?: WebpackPluginInstance[]
}

export function compile(fixture: string, options: Options = {}): Promise<any> {
  const compiler = webpack({
    context: path.resolve(__dirname, '../fixtures'),
    mode: 'production',
    entry: fixture,
    output: {
      path: path.resolve(__dirname, '../fixtures'),
      filename: 'bundle.js',
    },
    plugins: options.plugins,
  })

  // @ts-expect-error
  compiler.outputFileSystem = createFsFromVolume(new Volume())

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats && stats.hasErrors()) reject(new Error(stats.toJson().errors))

      resolve({ compiler, stats })
    })
  })
}
