import { EntityName } from '@bem/sdk.entity-name';

import { Attrs, BemProps, PossibleModifierValue } from '../interfaces';

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
export function isValidModValue(value: PossibleModifierValue) {
    return value && value !== '' ? true : false;
}

/**
 * BEM specified props.
 */
const BEM_PROPS = ['block', 'elem', 'elemMods', 'mix', 'mods', 'tag', 'forwardRef'];

/**
 * Returns a partial copy of props omitting the BEM specified props.
 *
 * @param props — result props
 */
export function omitBemProps(props: BemProps): Attrs {
    return Object.keys(props).reduce((acc, key) => {
        if (BEM_PROPS.includes(key)) {
            return acc;
        }

        return { ...acc, [key]: props[key] };
    }, {});
}
