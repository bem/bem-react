import * as React from 'react';

type Props = React.ClassAttributes<Object>;
type ReactClass = React.ComponentClass;
type ObjectMode = ((props: Props, state: object) => object) | object;
type Content = null | string | number | JSX.Element;
type MultipleContent = Array<Content>;

interface Declaration<P> {
    applyDecls(): React.ComponentClass<P>;
}

interface Mods {
    [modName: string]: number | boolean | string | undefined | null;
}

interface JsonMix {
    block: string;
    elem?: string;
    mods?: Mods;
    elemMods?: Mods;
}

type Mix = JsonMix | JsonMix[] | string | JSX.Element | JSX.Element[];
type Replaceble = null | number | string | JSX.Element;

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

type Mixin = ReactClass | Array<ReactClass>;
type Entity = Block | Elem;

interface EntityStatic {
    defaultProps?: Props,
    propTypes?: Props,
    contextTypes?: Props,
    childContextTypes?: Props,
    [fieldName: string]: any
}

/**
 * United BEM properties and HTML attributes
 */
interface BemBlock extends React.HTMLProps<Props> {
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
type Predicate = ((props: Props, state: object) => boolean | PredicateShort)

/**
 * Object syntax for modifier predicate
 *
 * @description
 * Usage:
 *  - function - will be called for validation
 *  - value - value of prop
 *  - '*' - all values will be matched
 */
interface PredicateShort {
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
