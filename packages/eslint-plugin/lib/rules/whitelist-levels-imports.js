'use strict';

const path = require('path');

const LEVEL_REGEXP = '^[\\w-]+$';

module.exports = {
    meta: {
        type: 'problem',
        schema: [
            {
                type: 'object',
                properties: {
                    defaultLevel: {
                        type: 'string',
                        pattern: LEVEL_REGEXP,
                    },
                    whiteList: {
                        type: 'object',
                        minProperties: 1,
                        patternProperties: {
                            [LEVEL_REGEXP]: {
                                type: 'array',
                                minItems: 1,
                                items: {
                                    type: 'string',
                                    pattern: LEVEL_REGEXP,
                                },
                            },
                        },
                    },
                    ignorePaths: {
                        type: 'array',
                        minItems: 1,
                        items: {
                            type: 'string',
                        },
                    },
                },
                required: ['defaultLevel', 'whiteList'],
            }
        ]
    },

    create: function(context) {
        const filepath = context.getFilename();
        const {
            whiteList,
            defaultLevel,
            ignorePaths,
        } = context.options[0];

        if (shouldIgnoreFile(filepath)) {
            return {};
        }

        const fileLevel = getLevelFromFilename(filepath) || defaultLevel;
        const allowedLevels = whiteList[fileLevel] || [];

        return {
            ImportDeclaration: function(node) {
                const importPath = node.source.value;
                const importLevel = getLevelFromFilename(importPath);

                if (importLevel && !allowedLevels.includes(importLevel)) {
                    context.report({
                        node: node,
                        message: 'Imports from \'{{ importLevel }}\' level in files from \'{{ fileLevel }}\' level are forbidden',
                        data: { importLevel, fileLevel },
                    });
                }
            },
        };

        /**
         * @param {String} filepath
         *
         * @returns {String|null}
         */
        function getLevelFromFilename(filepath) {
            const ext = path.extname(filepath);
            const basename = path.basename(filepath, ext);

            // import from 'foo/touch-phone'
            if (whiteList[basename]) {
                return basename;
            }

            // import from './foo@touch-phone'
            // import from './foo@touch-phone.example'
            const found = basename.match(/@([\w-]+)/);

            return found && found[1] || null;
        }

        /**
         * @param {String} filepath
         *
         * @returns {Boolean}
         */
        function shouldIgnoreFile(filepath) {
            return Array.isArray(ignorePaths) &&
                ignorePaths.some(path => new RegExp(path).test(filepath));
        }
    },
};
