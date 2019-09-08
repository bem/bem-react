'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/classnames.production.min.js')
} else {
  module.exports = require('./build/classnames.development.js')
}
