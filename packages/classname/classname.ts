/**
 * List of classname.
 */
export type ClassNameList = Array<string | undefined>

/**
 * Allowed modifiers format.
 *
 * @see https://en.bem.info/methodology/key-concepts/#modifier
 */
export type NoStrictEntityMods = Record<string, string | boolean | number | undefined>

/**
 * BEM Entity className initializer.
 */
export type ClassNameInitilizer = (blockName: string, elemName?: string) => ClassNameFormatter

/**
 * BEM Entity className formatter.
 */
export type ClassNameFormatter = (
  elemNameOrBlockMods?: NoStrictEntityMods | string | null,
  elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null,
  elemMix?: ClassNameList,
) => string

/**
 * Settings for the naming convention.
 */
export type Preset = {
  /**
   * Global namespace.
   *
   * @example `omg-Bem-Elem_mod_val`
   */
  n?: string
  /**
   * Elem's delimiter.
   */
  e?: string
  /**
   * Modifier's delimiter.
   */
  m?: string
  /**
   * Modifier value delimiter.
   */
  v?: string
}

const elemDelim = '-'
const modDelim = '_'

/**
 * BEM className configure function.
 *
 * @example
 * ``` ts
 *
 * import { withNaming } from '@bem-react/classname';
 *
 * const cn = withNaming({ n: 'ns-', e: '__', m: '_' });
 *
 * cn('block', 'elem'); // 'ns-block__elem'
 * ```
 *
 * @param preset settings for the naming convention
 */
export function withNaming(preset: Preset): ClassNameInitilizer {
  const nameSpace = preset.n || ''
  const modDelimiter = preset.m || modDelim
  const modValueDelimiter = preset.v || modDelimiter

  function stringify(b: string, e?: string, m?: NoStrictEntityMods | null, mix?: ClassNameList) {
    const entityName = e ? nameSpace + b + (preset.e || elemDelim) + e : nameSpace + b
    let className = entityName

    if (m) {
      const modPrefix = ' ' + className + modDelimiter

      for (const k in m) {
        if (m.hasOwnProperty(k)) {
          const modVal = m[k]

          if (modVal === true) {
            className += modPrefix + k
          } else if (modVal) {
            className += modPrefix + k + modValueDelimiter + modVal
          }
        }
      }
    }

    if (mix !== undefined) {
      for (let i = 0, len = mix.length; i < len; i++) {
        const value = mix[i]

        // Skipping non-string values and empty strings
        if (typeof value !== 'string' || !value) continue

        const mixes = value.split(' ')

        for (let j = 0; j < mixes.length; j++) {
          const val = mixes[j]
          if (val !== entityName) {
            className += ' ' + val
          }
        }
      }
    }

    return className
  }

  return function cnGenerator(b: string, e?: string): ClassNameFormatter {
    return (
      elemOrMods?: NoStrictEntityMods | string | null,
      elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null,
      elemMix?: ClassNameList,
    ) => {
      if (typeof elemOrMods === 'string') {
        if (Array.isArray(elemModsOrBlockMix)) {
          return stringify(b, elemOrMods, undefined, elemModsOrBlockMix)
        }
        return stringify(b, elemOrMods, elemModsOrBlockMix, elemMix)
      }
      return stringify(b, e, elemOrMods, elemModsOrBlockMix as ClassNameList)
    }
  }
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
 */
export const cn = withNaming({
  e: elemDelim,
  m: modDelim,
})
