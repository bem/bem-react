import fs from 'fs'
import { resolve } from 'path'
import { Compiler } from 'webpack'

export function getResult(compiler: Compiler): string {
  return (compiler.outputFileSystem as typeof fs).readFileSync(
    resolve(__dirname, '../fixtures/bundle.js'),
    'utf-8',
  )
}
