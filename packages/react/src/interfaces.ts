import { EntityName } from '@bem/sdk.entity-name';
import { AllHTMLAttributes, ClassAttributes, ComponentClass, ReactNode } from 'react';

/**
 * @param <T> — collection value
 */
export type Collection<T = {}> = Partial<{ [key: string]: T }>;

export type PossibleModifierValue = boolean | null | number | string | undefined;

export type Content = ReactNode | ReactNode[];

/**
 * @param <B> — props from base block
 * @param P — own props
 */
export type Modifier<B = {}, P = {}> = (props: B) => ModifierClass<P>;

/**
 * @param <P> — own props
 */
export type ModifierClass<P> = ComponentClass<P> & IModifierClass<P>;

/**
 * @param <P> — own props
 */
export interface IModifierClass<P> {
    mod(props: P): boolean;
}

export interface IBemPropsExtend {
    className?: string;
    children?: Content;
}

export type Attrs<T = {}> = AllHTMLAttributes<T> & ClassAttributes<T>;

export type Mods = Record<EntityName.ModifierName, EntityName.ModifierValue>;

export type Mix = string | IBemjson | MixesArray;

export type MixesArray = (string | IStrictBemjson)[];

export interface IBemjson {
    tag?: string;
    block?: string;
    mods?: Mods;
    mix?: Mix;
    elem?: string;
    elemMods?: Mods;
}

export type BemProps = IBemjson & IBemPropsExtend & Collection<any>;

export interface IStrictBemjson extends BemProps {
    block: string;
}
