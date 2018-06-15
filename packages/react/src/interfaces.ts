import { ComponentClass, ReactNode } from 'react';

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
