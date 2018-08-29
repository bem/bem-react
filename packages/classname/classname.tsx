import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
import { INamingConvention } from '@bem/sdk.naming.presets';

const react = require('@bem/sdk.naming.presets/react');

export type NoStrictEntityMods = Record<string, string | boolean | number | undefined>;

export type ClassNameFormatter = (mods?: NoStrictEntityMods) => string;

function modsToEntities(block: string, elem?: string, mods?: NoStrictEntityMods): any[] {
    if (!mods) return [{ block, elem }];

    const arr = [];

    for (const modName in mods) {
        if (mods[modName] || mods[modName] === 0) {
            arr.push({ block, elem, mod: {
                name: modName,
                val: mods[modName] === true ? true : String(mods[modName]),
            }});
        }
    }

    return arr;
}

export function configure(preset: INamingConvention) {
    const naming = stringifyWrapper(preset);

    return (block: string, elem?: string): ClassNameFormatter =>
        (mods?: NoStrictEntityMods) => modsToEntities(block, elem, mods).map(naming).join(' ');
}

export const cn = configure(react);
