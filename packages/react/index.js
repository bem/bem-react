'use strict';

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./build/cjs/bem-react-core.production.min.js');
} else {
    module.exports = require('./build/cjs/bem-react-core.development.js');
}
