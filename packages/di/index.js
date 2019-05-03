'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./build/di.production.min.js');
} else {
    module.exports = require('./build/di.development.js');
}
