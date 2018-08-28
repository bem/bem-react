'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./build/cjs/core.production.min.js');
} else {
    module.exports = require('./build/cjs/core.development.js');
}
