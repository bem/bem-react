'use strict'

const { resolve } = require('path')

/**
 * @type {import('ts-jest/dist/types').TsJestConfig}
 */
const tsJestConfig = {
  tsConfig: {
    noUnusedLocals: true,
    noUnusedParameters: true,
  },
}

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  rootDir: process.cwd(),
  setupFiles: [resolve(__dirname, 'jest.setup.js')],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.test.{ts,tsx}'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/*.test.{ts,tsx}'],
  globals: {
    'ts-jest': tsJestConfig,
  },
}
