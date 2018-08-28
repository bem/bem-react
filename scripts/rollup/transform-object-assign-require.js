'use strict';

const { addDefault } = require('@babel/helper-module-imports');

function getAssignIdentifier(path, file, state) {
    if (state.id) {
        return state.id;
    }
    state.id = addDefault(path, 'object-assign', { nameHint: 'assign' })
    return state.id;
}

module.exports = (babel) => {
    return {
        pre: function () {
            // map from module to generated identifier
            this.id = null;
        },

        visitor: {
            CallExpression: function (path, file) {
                if (path.get('callee').matchesPattern('Object.assign')) {
                    // generate identifier and require if it hasn't been already
                    path.node.callee = getAssignIdentifier(path, file, this);
                }
            },

            MemberExpression: function (path, file) {
                if (path.matchesPattern('Object.assign')) {
                    path.replaceWith(getAssignIdentifier(path, file, this));
                }
            }
        }
    };
};
