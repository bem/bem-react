import path from 'path'
import webpack from 'webpack'
import { createFsFromVolume, Volume } from 'memfs'

export function compiler(fixture: any, options: any = {}) {
  const $compiler = webpack({
    context: __dirname,
    entry: `./${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.txt$/,
          use: {
            loader: path.resolve(__dirname, '../src/loader.js'),
            options,
          },
        },
      ],
    },
    plugins: options.plugins,
  })

  $compiler.outputFileSystem = createFsFromVolume(new Volume())
  $compiler.outputFileSystem.join = path.join.bind(path)

  return new Promise((resolve, reject) => {
    $compiler.run((err, stats) => {
      if (err) reject(err)
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors))

      resolve(stats)
    })
  })
}
