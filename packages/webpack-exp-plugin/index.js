'use strict'

const { NormalModuleReplacementPlugin } = require('webpack')
const replacerToExp = require('./replacer')

class WebpackExpPlugin extends NormalModuleReplacementPlugin {
  constructor(packageName, experiments = {}) {
    if (!packageName) {
      throw new Error('Missing package name.')
    }

    const replacer = replacerToExp.bind(null, packageName, experiments)

    super(new RegExp(packageName), (result) => {
      result.request = replacer(result.request)
    })
  }
}

module.exports = WebpackExpPlugin
