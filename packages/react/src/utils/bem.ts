import { EntityName } from '@bem/sdk.entity-name';

import { PossibleModValue } from '../interfaces';

/**
 * Makes unique token based on block and/or elem fields.
 *
 * @param entity
 * @return token
 */
export function tokenizeEntity({ block, elem }: EntityName.IOptions) {
    return `${block}$${elem}`;
}

/**
 * Check falsy values in modifiers values.
 *
 * @param value modifier value
 * @return is valid value
 */
export function isValidModValue(value: PossibleModValue) {
    return value && value !== '' ? true : false;
}
