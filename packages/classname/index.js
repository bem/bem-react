'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/classname.production.min.js')
} else {
  module.exports = require('./build/classname.development.js')
}
