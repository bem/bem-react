'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/classnames.production.min.cjs')
} else {
  module.exports = require('./build/classnames.development.cjs')
}
