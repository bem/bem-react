'use strict'

const { resolve } = require('path')

/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  rootDir: process.cwd(),
  setupFiles: [resolve(__dirname, 'jest.setup.js')],
  preset: 'ts-jest',
  testMatch: ['<rootDir>/**/*.test.{ts,tsx,js}'],
  collectCoverageFrom: ['**/*.{ts,tsx}', '!**/*.d.ts', '!**/*.test.{ts,tsx}'],
  testEnvironment: 'jsdom',
}
