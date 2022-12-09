#!/usr/bin/env node

'use strict'

const { execSync } = require('child_process')

execSync('git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/master')
const commitMessages = execSync('git log origin/master..HEAD --pretty=format:%s')
  .toString()
  .split('\n')
  .map((message) => message.trim())
  .filter((message) => message)

const errors = []

// eslint-disable-next-line no-console
console.log('❯ commits:', commitMessages)

for (let message of commitMessages) {
  message = message.trim().replace(/'/g, "'\\''")
  try {
    execSync(`echo '${message}' | npx commitlint`, { stdio: 'inherit' })
  } catch (error) {
    errors.push(error)
  }
}

if (errors.length !== 0) {
  process.exit(1)
}
