import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';

const react = {
    delims: {
        elem: '-',
        mod: {
            name: '_',
            val: '_',
        },
    },
    fs: {
        pattern: '${entity}${layer?@${layer}}.${tech}',
        scheme: 'nested',
        delims: { elem: '' },
    },
    wordPattern: '[a-zA-Z0-9]+',
};

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
 * List of classname.
 *
 * @@bem-react/classname
 */
export type ClassNameList = Array<string | undefined>;

/**
 * BEM Entity className formatter.
 *
 * @@bem-react/classname
 */
export type ClassNameFormatter = (
    elemNameOrBlockMods?: NoStrictEntityMods | string | null,
    elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null,
    elemMix?: ClassNameList,
) => string;

export const BLOCK_NAME_PLACEHOLDER = '@';
const blockNamePlaceholderRegExp = new RegExp(BLOCK_NAME_PLACEHOLDER, 'g');

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
export function withNaming(preset: any): ClassNameInitilizer {
    const naming = stringifyWrapper(preset);

    const stringify = (blockName: string, entities: any[]): string => {
        const classList = entities.map((entity: any) => {
            if (typeof entity === 'string') {
                return entity.replace(blockNamePlaceholderRegExp, blockName);
            }

            return naming(entity);
        });

        return classnames.apply(null, classList);
    };

    const modsToEntities = (block: string, elem?: string, mods?: NoStrictEntityMods | null): any[] => {
        const entities: any[] = [{ block, elem }];

        mods && Object.keys(mods).forEach(name => {
            if (mods[name] || mods[name] === 0) {
                entities.push({ block, elem, mod: {
                    name,
                    val: mods[name] === true ? true : String(mods[name]),
                }});
            }
        });

        return entities;
    };

    return (blockName: string, elemName?: string): ClassNameFormatter => (
        (
            elemOrBlockMods?: NoStrictEntityMods | string | null,
            elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null,
            elemMix?: ClassNameList,
        ) => {
            const entities = typeof elemOrBlockMods === 'string'
                ? Array.isArray(elemModsOrBlockMix)
                    ? modsToEntities(blockName, elemOrBlockMods).concat(elemModsOrBlockMix)
                    : modsToEntities(blockName, elemOrBlockMods, elemModsOrBlockMix).concat(elemMix)
                : Array.isArray(elemModsOrBlockMix)
                    ? modsToEntities(blockName, elemName, elemOrBlockMods).concat(elemModsOrBlockMix)
                    : modsToEntities(blockName, elemName, elemOrBlockMods).concat(elemMix);

            return stringify(blockName, entities);
        }
    );
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
 * classNames merge function.
 *
 * @example
 * ``` ts
 *
 * import { classnames } from '@bem-react/classname';
 *
 * classnames('Block', 'Mix', undefined, 'Block'); // 'Block Mix'
 * ```
 *
 * @param strings classNames strings
 *
 * @@bem-react/classname
 */
export const classnames = (...strings: ClassNameList) => {
    let classString = '';

    strings.forEach(className => {
        className && className.split(' ').forEach(part => {
            !classString.includes(part) && (classString += ' ' + part);
        });
    });

    return classString.trim();
};
