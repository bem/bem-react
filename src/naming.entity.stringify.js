/* eslint-disable */

'use strict';

/**
 * Forms a string according to object representation of BEM entity.
 *
 * @param {Object|BemEntityName} entity - object representation of BEM entity.
 * @param {BemNamingDelims} delims - separates entity names from each other.
 * @returns {String}
 */
function stringify(entity, delims) {
    if (!entity || !entity.block) {
        return '';
    }

    let res = entity.block;

    if (entity.elem) {
        res += delims.elem + entity.elem;
    }

    const modObj = entity.mod;
    const modName = (typeof modObj === 'string' ? modObj : modObj && modObj.name) ||
        !entity.__isBemEntityName__ && entity.modName;

    if (modName) {
        const hasModVal = modObj && modObj.hasOwnProperty('val') || entity.hasOwnProperty('modVal');
        const modVal = modObj && modObj.val || !entity.__isBemEntityName__ && entity.modVal;

        if (modVal || modVal === 0 || !hasModVal) {
            res += delims.mod.name + modName;
        }

        if (modVal && modVal !== true) {
            res += delims.mod.val + modVal;
        }
    }

    return res;
}

/**
 * Creates `stringify` function for specified naming convention.
 *
 * @param {BemNamingEntityConvention} convention - options for naming convention.
 * @returns {Function}
 */
module.exports = (convention) => {
    return (entity) => stringify(entity, convention.delims);
};
