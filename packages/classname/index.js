'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./build/cjs/di.production.min.js');
} else {
    module.exports = require('./build/cjs/di.development.js');
}
