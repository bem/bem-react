import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
import { INamingConvention } from '@bem/sdk.naming.presets';

const react = require('@bem/sdk.naming.presets/react');

/**
 * Allowed modifiers format.
 *
 * @see https://en.bem.info/methodology/key-concepts/#modifier
 *
 * @@bem-react/classname
 */
export type NoStrictEntityMods = Record<string, string | boolean | number | undefined>;

/**
 * BEM Entity className initializer.
 *
 * @@bem-react/classname
 */
export type ClassNameInitilizer = (blockName: string, elemName?: string) => ClassNameFormatter;

/**
 * BEM Entity className formatter.
 *
 * @@bem-react/classname
 */
export type ClassNameFormatter = (elemNameOrBlockMods?: NoStrictEntityMods | string, elemMods?: NoStrictEntityMods) => string;

function modsToEntities(block: string, elem?: string, mods?: NoStrictEntityMods): any[] {
    const def = [{ block, elem }];
    const entities = [];

    if (!mods) return def;

    for (const name in mods) {
        if (mods[name] || mods[name] === 0) {
            entities.push({ block, elem, mod: {
                name,
                val: mods[name] === true ? true : String(mods[name]),
            }});
        }
    }

    return entities.length === 0 ? def : entities;
}

/**
 * BEM className configure function.
 *
 * @example
 * ``` ts
 *
 * import { withNaming } from '@bem-react/classname';
 * import { origin } from '@bem/sdk.naming.presets';
 *
 * const cn = withNaming(origin);
 *
 * cn('block', 'elem'); // 'block__elem'
 * ```
 *
 * @param preset settings for the naming convention
 * @see https://github.com/bem/bem-sdk/tree/master/packages/naming.presets
 *
 * @@bem-react/classname
 */
export function withNaming(preset: INamingConvention): ClassNameInitilizer {
    const naming = stringifyWrapper(preset);
    const stringify = (entities: any): string => entities.map(naming).join(' ');

    return (blockName: string, elemName?: string): ClassNameFormatter =>
        (elemOrBlockMods?: NoStrictEntityMods | string, elemMods?: NoStrictEntityMods) =>
            typeof elemOrBlockMods === 'string'
                ? stringify(modsToEntities(blockName, elemOrBlockMods, elemMods))
                : stringify(modsToEntities(blockName, elemName, elemOrBlockMods));
}

/**
 * BEM Entity className initializer with React naming preset.
 *
 * @example
 * ``` ts
 *
 * import { cn } from '@bem-react/classname';
 *
 * const cat = cn('Cat');
 *
 * cat(); // Cat
 * cat({ size: 'm' }); // Cat_size_m
 * cat('Tail'); // Cat-Tail
 * cat('Tail', { length: 'small' }); // Cat-Tail_length_small
 *
 * const dogPaw = cn('Dog', 'Paw');
 *
 * dogPaw(); // Dog-Paw
 * dogPaw({ color: 'black', exists: true }); // Dog-Paw_color_black Dog-Paw_exists
 * ```
 *
 * @see https://en.bem.info/methodology/naming-convention/#react-style
 *
 * @@bem-react/classname
 */
export const cn = withNaming(react);

/**
 * BEM classNames list merge.
 *
 * @example
 * ``` ts
 *
 * import { list } from '@bem-react/classname';
 *
 * list('Block', 'Mix', undefined, 'Block'); // 'Block Mix'
 * ```
 *
 * @param strings classNames strings
 *
 * @@bem-react/classname
 */
export const list = (...strings: Array<string | undefined>) => {
    let classString = '';

    for (const className of strings) {
        if (className) {
            for (const part of className.split(' ')) {
                !classString.includes(part) && (classString += ` ${part}`);
            }
        }
    }

    return classString.trim();
};
