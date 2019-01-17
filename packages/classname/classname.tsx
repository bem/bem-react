/**
 * List of classname.
 *
 * @@bem-react/classname
 */
export type ClassNameList = Array<string | undefined>;

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
export type ClassNameFormatter = (
    elemNameOrBlockMods?: NoStrictEntityMods | string | null,
    elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null,
    elemMix?: ClassNameList,
) => string;

/**
 * Settings for the naming convention.
 * @@bem-react/classname
 */
export interface IPreset {
    /**
     * Global namespace.
     *
     * @example `omg-Bem-Elem_mod_val`
     */
    n?: string;
    /**
     * Elem's delimeter.
     */
    e?: string;
    /**
     * Modifier's delimeter.
     */
    m?: string;
}

interface IStringifierOptions {
    b: string;
    e?: string;
    m?: NoStrictEntityMods | null;
    mix?: ClassNameList;
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
export function withNaming(preset: IPreset): ClassNameInitilizer {
    function stringify(o: IStringifierOptions) {
        const b = (preset.n || '') + o.b;
        const mixins: string[] = [];
        let className = b + (!o.e ? '' : preset.e + o.e);

        if (o.mix !== undefined) {
            o.mix.forEach((value?: string) => {
                if (value !== undefined) {
                    const uniqueValues = value
                        .split(' ')
                        .filter((val: string) => val !== className);
                    mixins.push(...uniqueValues);
                }
            });
        }

        className += addMods(o.m);

        if (mixins.length > 0) {
            className += ' ' + mixins.join(' ');
        }

        function addMods(m?: NoStrictEntityMods | null) {
            const a = m || Object.create(null);
            const pairs = Object.keys(a).filter(k => a[k]).map(k => a[k] === true ? [k] : [k, a[k]]);

            return !pairs.length
                ? ''
                : ' ' + pairs.map(pair => (o.e ? b + preset.e + o.e : b) + preset.m + pair.join(preset.m)).join(' ');
        }

        return className;
    }

    return function cnGenerator(b: string, e?: string): ClassNameFormatter {
        return (
            elemOrMods?: NoStrictEntityMods | string | null,
            elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null,
            elemMix?: ClassNameList,
        ) => {
            const entity: IStringifierOptions = { b, e };

            if (typeof elemOrMods === 'string') {
                entity.e = elemOrMods;

                if (Array.isArray(elemModsOrBlockMix)) {
                    entity.mix = elemModsOrBlockMix;
                } else {
                    entity.m = elemModsOrBlockMix as NoStrictEntityMods;
                    entity.mix = elemMix;
                }
            } else {
                entity.m = elemOrMods;
                entity.mix = elemModsOrBlockMix as ClassNameList;
            }

            return stringify(entity);
        };
    };
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
export const cn = withNaming({
    e: '-',
    m: '_',
});
