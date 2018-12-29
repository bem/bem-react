import * as React from 'react';

export type Props = React.ClassAttributes<Object>;
export type ReactClass = React.ComponentClass;
export type ObjectMode = ((props: Props, state: object) => object) | object;
export type Content = null | string | number | JSX.Element;
export type MultipleContent = Array<Content>;

export interface Declaration<P> {
    applyDecls(): React.ComponentClass<P>;
}

export interface Mods {
    [modName: string]: number | boolean | string | undefined | null;
}

export interface JsonMix {
    block: string;
    elem?: string;
    mods?: Mods;
    elemMods?: Mods;
}

export type Mix = JsonMix | JsonMix[] | JSX.Element | JSX.Element[];
export type Replaceble = null | number | string | JSX.Element;

export declare interface Block {
    block: string;
    tag?: string;
    cls?: ((props: Props, state: object) => string) | string;
    addBemClassName?: ((props: Props, state: object) => boolean) | boolean;
    style?: ObjectMode;
    attrs?: ObjectMode;
    mods?: Mods | ((props: Props, state: object) => Mods);
    mix?: Mix | ((props: Props, state: object) => Mix);
    addMix?: Mix | ((props: Props, state: object) => Mix);
    content?: ((props: Props, state: object) => Content | MultipleContent) | Content | MultipleContent;
    replace?: ((props: Props, state: object) => Replaceble) | Replaceble;
    wrap?(props: Props, state: object, klass: ReactClass): Content;
    willInit?(props: Props): void;
}

export declare interface Elem extends Block {
    elem: string;
}

export type Mixin = ReactClass | Array<ReactClass>;
export type Entity = Block | Elem;

export interface EntityStatic {
    defaultProps?: Props,
    propTypes?: Props,
    contextTypes?: Props,
    childContextTypes?: Props,
    [fieldName: string]: any
}

/**
 * United BEM properties and HTML attributes
 */
export interface BemBlock extends React.HTMLProps<Props> {
    block?: string;
    elem?: string
    tag?: string;
    cls?: string;
    addBemClassName?: boolean;
    style?: object;
    attrs?: object;
    mods?: Mods;
    mix?: Mix;
}

/**
 * BEM Component for fast usage without declarations
 */
export declare class Bem<S> extends React.Component<BemBlock, S> {
    props: Readonly<BemBlock>;
}

/**
 * Modifier predicate
 *
 * @description
 * Simple function with [short syntax]{@link PredicateShort}
 */
export type Predicate = ((props: Props, state: object) => boolean | PredicateShort)

/**
 * Object syntax for modifier predicate
 *
 * @description
 * Usage:
 *  - function - will be called for validation
 *  - value - value of prop
 *  - '*' - all values will be matched
 */
export interface PredicateShort {
    [prop: string]: ((props: Props, state: object) => boolean) | (number | string | boolean) | '*'
}

/**
 * Block or element declaration
 */
export function decl(entity: Entity, static?: EntityStatic, wrapper?: Function): Declaration<Props>;
export function decl(mixin: Mixin, entity: Entity, static?: EntityStatic, wrapper?: Function): Declaration<Props>;

/**
 * Modifier declaration
 */
export function declMod(predicate: Predicate, fields: Entity, staticFields?: EntityStatic): Declaration<Props>;
