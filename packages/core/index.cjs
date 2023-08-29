'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/core.production.min.cjs')
} else {
  module.exports = require('./build/core.development.cjs')
}
