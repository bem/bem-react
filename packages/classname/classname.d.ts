export declare type NoStrictEntityMods = Record<string, string | boolean | number | undefined>;
export declare type ClassNameInitilizer = (blockName: string, elemName?: string) => ClassNameFormatter;
export declare type ClassNameList = Array<string | undefined>;
export declare type ClassNameFormatter = (elemNameOrBlockMods?: NoStrictEntityMods | string | null, elemModsOrBlockMix?: NoStrictEntityMods | ClassNameList | null, elemMix?: ClassNameList) => string;
export declare function withNaming(preset: any): ClassNameInitilizer;
export declare const cn: ClassNameInitilizer;
export declare const classnames: (...strings: (string | undefined)[]) => string;
