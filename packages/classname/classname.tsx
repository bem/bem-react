import { stringifyWrapper } from '@bem/sdk.naming.entity.stringify';

const react = require('@bem/sdk.naming.presets/react');

export type NoStrictEntityMods = Record<string, string | boolean | number | undefined>;

export type EntityFormatter = (mods?: NoStrictEntityMods) => string;

function modsToArray(block: string, elem?: string, mods?: NoStrictEntityMods) {
    const arr = [];

    if (!mods) return [];

    for (const modName in mods) {
        if (mods[modName] || mods[modName] === 0) {
            arr.push({
                block,
                elem,
                mod: {
                    name: modName,
                    val: mods[modName] === true ? true : String(mods[modName]),
                },
            });
        }
    }

    return arr;
}

<<<<<<< HEAD
export function cn(block: string, elem?: string): EntityFormatter {
=======
export function entity(block: string, elem?: string): EntityFormatter {
>>>>>>> feat(v3): init packages
    const naming = stringifyWrapper(react);

    return (mods?: NoStrictEntityMods) => modsToArray(block, elem, mods).map(naming).join(' ');
}
