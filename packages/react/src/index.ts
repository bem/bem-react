/* tslint:disable:no-shadowed-variable */
/// <reference types="@bem/sdk.entity-name" />
import * as entityStringifier from '@bem/sdk.naming.entity.stringify';
import * as React from 'react';

// React dependant types start -------------------------------------------
export type Attrs<T = {}> = React.AllHTMLAttributes<T>;
export type Style = React.CSSProperties;

interface IPreset {
    Base: typeof React.Component;
    render: typeof React.createElement;
    naming: INamingPreset;
}

export type EntityClass<P = {}, S = {}> = React.Component<P, S>;
export type Tag = keyof React.ReactHTML;
export type Entity = React.ReactNode;
export type SFC<P> = React.SFC<P>;

type BaseContent = null | string | number | JSX.Element;

export type EntityProps<P = {}> = React.ClassAttributes<P> & IBemPropsExtend & P;
// React dependant types end --------------------------------------------

/**
 * BEM naming preset.
 * Package: @bem/sdk.naming
 */
interface INamingPreset {
    delims: {
        elem: string;
        mod: {
            name: string;
            val: string;
        }
    };
    fs: {
        pattern: string;
        scheme: string;
    };
    wordPattern: string;
}

export type Mods = Record<BEMSDK.EntityName.ModifierName, BEMSDK.EntityName.ModifierValue>;

export type Mix = string | IBemJson | MixesArray;
type MixesArray = Array<string | IBemJson>;

interface IBemJson {
    tag?: Tag;
    block?: string;
    mods?: Mods;
    mix?: Mix;
    elem?: string;
    elemMods?: Mods;
}

export type Content = BaseContent | BaseContent[];

interface IBemPropsExtend {
    className?: string;
    children?: Content;
}

export type BemProps = IBemJson & IBemPropsExtend;

type ClassNameBuilderSignature =  (entity: BEMSDK.EntityName.Options) => string;

// TODO(yarastqt): move to project assembly (rollup or webpack)
const __DEV__ = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

function inherits(Super, Inherited): EntityClass {
    Inherited.super_ = Super;
    Object.setPrototypeOf(Inherited.prototype, Super.prototype);
    return Object.setPrototypeOf(Inherited, Super);
}
/**
 * Makes unique token based on block and/or elem fields
 */
function tokenizeEntity({ block, elem }: BEMSDK.EntityName.Options): string {
    return `${block}$${elem}`;
}
/**
 * Restores block and/or elem fields from unique token
 */
function parseEntityToken(id: string): BEMSDK.EntityName.Options {
    const entity = id.split('$');
    return {
        block: entity[0],
        elem: entity[1] === 'undefined'
            ? undefined
            : entity[1]
        };
}

/**
 * Map mods on entites in BEMSDK format and makes classString
 * https://github.com/bem/bem-sdk/tree/master/packages/entity-name
 *
 * @param entity object to map
 * @param mods modifiers object
 */
function modsToClassStrings(
    entity: BEMSDK.EntityName.Options,
    mods: Mods,
    classNameBuilder
): string[] {
    return Object.keys(mods).reduce((validEntities: string[], modName) => {
        if (isValidModVal(mods[modName])) {
            validEntities.push(classNameBuilder({
                ...entity,
                mod: {
                    name: modName,
                    val: mods[modName]
                }
            }));
        }
        return validEntities;
    }, []);
}
/**
 * Compatibility method for supporting elemMods for elems in bemjson
 */
function selectMods({ elemMods = {}, mods = {} }: Partial<IBemJson>): Mods {
    return Object.keys(elemMods).length ? elemMods : mods;
}
/**
 * Check falsy values in modifiers values
 */
type PossibleModVal = null | string | boolean | undefined | number;
function isValidModVal(val: PossibleModVal): boolean {
    return val && val !== '' && Boolean(val);
}
/**
 * Constructor for strigifier.
 * It returns function wich makes className from BemJson.
 *
 * @param namingPreset - bem-sdk/naming presets.
 * https://github.com/bem/bem-sdk/tree/master/packages/naming.presets
 */
function bemjsonStringify(namingPreset: INamingPreset) {
    return ({ block, elem, mods, elemMods, mix, className }: Partial<BemProps>): string => {
        const classNameBuilder: ClassNameBuilderSignature = entityStringifier(namingPreset);
        const modsClassStrings = modsToClassStrings(
            { block, elem },
            selectMods({ elemMods, mods }),
            classNameBuilder
        );

        const classStrings = [classNameBuilder({ block, elem })].concat(modsClassStrings);
        const mixes: MixesArray = [].concat(mix);

        if (mixes.length) {
            const mixedEntitiesStore = {} as Record<string, IBemJson>;
            const addMixedToStore = (mixed: IBemJson): void => {
                const { block, elem, mods, elemMods } = mixed;
                const k = tokenizeEntity({ block, elem });

                mixed.mods = selectMods({ elemMods, mods });

                if (mixedEntitiesStore[k]) {
                    mixedEntitiesStore[k].mods = Object.assign(
                        selectMods({ ...mixed, ...mixedEntitiesStore[k] }), mixed.mods
                    );
                } else {
                    mixedEntitiesStore[k] = mixed;
                }
            };
            const walkMixes = (mixes: MixesArray): void => {
                for (const entity of mixes) {
                    if (entity) {
                        if (typeof entity === 'string') {
                            classStrings.push(entity);
                        } else {
                            addMixedToStore(entity);

                            if (entity.mix) {
                                walkMixes([].concat(entity.mix));
                            }
                        }
                    }
                }
            };

            walkMixes(mixes);

            for (const k in mixedEntitiesStore) {
                const mixed = mixedEntitiesStore[k];
                const mixedMods = mixed.mods;
                const mixedBlock = mixed.block || block;
                const mixedElem = mixed.elem;

                classStrings.push(classNameBuilder({ block: mixedBlock, elem: mixedElem }));

                if (mixedMods) {
                    for (const name in mixedMods) {
                        if (isValidModVal(mixedMods[name])) {
                            classStrings.push(classNameBuilder({
                                block: mixedBlock,
                                elem: mixedElem,
                                mod: { name, val: mixedMods[name] }
                            }));
                        }
                    }
                }
            }
        }

        if (className) {
            classStrings.push(className);
        }

        return classStrings.join(' ');
    };
}

const bemProps = ['block', 'elem', 'elemMods', 'mix', 'mods', 'tag'];
/**
 * Remove bem specified props from result props before rendering
 *
 * @param props component props
 */
function cleanBemProps(props: BemProps): Attrs {
    const newProps = {} as Attrs;
    for (const prop in props) {
        if (!bemProps.includes(prop)) {
            newProps[prop] = props[prop];
        }
    }
    return newProps;
}
/**
 * Make core instance for any Virtual DOM based framework
 *
 * @param preset - preset for core library, ex: React, Preact and etc.
 */
export function declareBemCore(preset: IPreset) {
    let uniqCount = 0;
    const bemContext = {
        bemBlock: () => null
    };
    const stringify = bemjsonStringify(preset.naming);

    class Anb<P = {}, S = {}> extends preset.Base<P, S> {
        public static childContextTypes = bemContext;
        public static contextTypes = bemContext;

        protected get blockName() {
            return null;
        }

        protected get elemName() {
            return null;
        }

        private getChildContext() {
            const block = this.blockName;
            const elem = this.elemName;
            const contextBlock = this.context.bemBlock;

            return block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined' ?
                { bemBlock: block } :
                {};
        }
    }

    class Bem<P, S = {}> extends Anb<BemProps & Attrs<P>, S> {
        public static displayName = 'Bem';

        public static defaultProps: Partial<BemProps> = {
            tag: 'div',
            mods: Object.create(null) as Mods,
            elemMods: Object.create(null) as Mods
        };

        public props: BemProps & Attrs<P>;

        public render() {
            const { tag, mods, elemMods, mix, className } = this.props;
            let block = this.blockName;
            const elem = this.elemName;

            if (typeof block === 'undefined') {
                block = this.context.bemBlock;
            }

            if (__DEV__) {
                if (!this.props.elem && !this.props.block && this.context.bemBlock) {
                    throw new Error('Prop elem must be specified');
                }

                if (!block) {
                    throw new Error('Can\'t get block from context');
                }
            }

            return preset.render(tag, {
                ...cleanBemProps(this.props),
                className: stringify({
                    block,
                    elem,
                    mods,
                    elemMods,
                    mix,
                    className
                })
            });
        }

        protected get blockName(): string {
            return this.props.block;
        }

        protected get elemName(): string {
            return this.props.elem;
        }
    }

    class Block<P = {}, S = {}> extends Anb<EntityProps<P>, S> {
        public static defaultProps = {};
        public static displayName: string;
        /**
         * Predicate for entity modifier
         *
         * @param props common props
         */
        public static mod?(props: EntityProps): boolean {
            return false;
        }

        public props: EntityProps<P>;
        public state: S;

        protected block: string;

        private __uniqId: Record<string, string>;

        public render() {
            const { props, state } = this;
            const optionalyReplaced = this.replace(props, state);

            return this.wrap(props, state, optionalyReplaced);
        }

        protected getClassNameParams() {
            const { props, state } = this;
            return {
                block: this.blockName,
                mods: this.mods(props, state),
                mix: this.mix(props, state),
                className: this.props.className
            };
        }

        protected get blockName(): string {
            return this.block;
        }

        protected tag(p: EntityProps<P>, s: S): Tag {
            return 'div';
        }

        protected attrs(p: EntityProps<P>, s: S): Attrs<EntityProps<P>> {
            return Object.create(null);
        }

        protected style(p: EntityProps<P>, s: S): Style {
            return Object.create(null);
        }

        protected mods(p: EntityProps<P>, s: S): Mods {
            return Object.create(null);
        }

        protected mix(p: EntityProps<P>, s: S): Mix {
            return null;
        }

        protected content(p: EntityProps<P>, s: S): Content {
            return this.props.children;
        }

        protected replace(p: EntityProps<P>, s: S): Entity {
            return this.prerender();
        }

        protected wrap(p: EntityProps<P>, s: S, component: Entity): Entity {
            return component;
        }
        /**
         * Generates unique id from global counter.
         *
         * @example
         * this.generateId() // => 'uniq341'
         *
         * @modifies {uniqCount}
         * @param key prefix for id string, 'uniq' by default
         */
        protected generateId(key: string = 'uniq'): string {
            this.__uniqId = this.__uniqId || {};
            return this.__uniqId[key] !== undefined
                ? this.__uniqId[key]
                : (this.__uniqId[key] = `${key}${++uniqCount}`);
        }
        /**
         * Resets global counter for unique ids
         *
         * @modifies {uniqCount}
         */
        protected resetId(): void {
            uniqCount = 0;
        }

        protected displayName(): void {
            Block.displayName = stringify({
                block: this.blockName
            });
        }

        private prerender() {
            const { props, state } = this;
            const { className } = props;
            const attrs = this.attrs(props, state);
            const style = this.style(props, state);

            const classNameParams = this.getClassNameParams();

            this.displayName();

            return preset.render(this.tag(props, state), Object.assign({}, {
                ...cleanBemProps(this.props),
                ...{ ...attrs, style : { ...attrs.style, ...style } },
                children: this.content(props, state),
                className: stringify(classNameParams)
            }));
        }
    }

    class Elem<P = {}, S = {}> extends Block<P, S> {
        protected elem: string;

        protected getClassNameParams() {
            return {
                ...super.getClassNameParams(),
                mods: {},
                elem: this.elemName,
                elemMods: this.elemMods(this.props, this.state)
            };
        }

        protected get elemName(): string {
            return this.elem;
        }

        protected elemMods(p: EntityProps<P>, s: S): Mods {
            return Object.create(null);
        }

        protected displayName(): void {
            Block.displayName = stringify({
                block: this.blockName,
                elem: this.elemName
            });
        }
    }

    type AnyEntity = Partial<typeof Block | typeof Elem>;
    type ModDecl<P = {}> = (props: P) => AnyEntity;

    // tslint:disable:max-line-length
    interface IWithModsSignature {
        <P0, P1, P2, P3, P4, P5, P6, P7, P8, P9>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>, p4: ModDecl<P4>, p5: ModDecl<P5>, p6: ModDecl<P6>, p7: ModDecl<P7>, p8: ModDecl<P8>, p9: ModDecl<P9>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8 & P9>;
        <P0, P1, P2, P3, P4, P5, P6, P7, P8>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>, p4: ModDecl<P4>, p5: ModDecl<P5>, p6: ModDecl<P6>, p7: ModDecl<P7>, p8: ModDecl<P8>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6 & P7 & P8>;
        <P0, P1, P2, P3, P4, P5, P6, P7>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>, p4: ModDecl<P4>, p5: ModDecl<P5>, p6: ModDecl<P6>, p7: ModDecl<P7>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6 & P7>;
        <P0, P1, P2, P3, P4, P5, P6>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>, p4: ModDecl<P4>, p5: ModDecl<P5>, p6: ModDecl<P6>): SFC<P0 & P1 & P2 & P3 & P4 & P5 & P6>;
        <P0, P1, P2, P3, P4, P5>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>, p4: ModDecl<P4>, p5: ModDecl<P5>): SFC<P0 & P1 & P2 & P3 & P4 & P5>;
        <P0, P1, P2, P3, P4>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>, p4: ModDecl<P4>): SFC<P0 & P1 & P2 & P3 & P4>;
        <P0, P1, P2, P3>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>, p3: ModDecl<P3>): SFC<P0 & P1 & P2 & P3>;
        <P0, P1, P2>(base: AnyEntity, p0: ModDecl<P0>, p1: ModDecl<P1>, p2: ModDecl<P2>): SFC<P0 & P1 & P2>;
        <P0, P1>(base: AnyEntity, h0: ModDecl<P0>, h1: ModDecl<P0>): SFC<P0 & P1>;
        <P0>(base: AnyEntity, h0: ModDecl<P0>): SFC<P0>;
        (base: any, ...hocs: any[]): SFC<any>;
    }
    // tslint:enable:max-line-length
    const withMods: IWithModsSignature = function(Base: AnyEntity, ...modDecls: ModDecl[]) {
        return function modsHoc(props: EntityProps) {
            const mixins = modDecls.reduce((mixins: AnyEntity[], modDecl: ModDecl) => {
                const EntityClass = modDecl(props);
                if (EntityClass.mod(props)) {
                    mixins.push(EntityClass);
                }
                return mixins;
            }, []);

            const mergedComponent = !mixins.length
                ? Base
                : mixins.reduce(inherits, mixins.splice(0, 1)[0]);

            return preset.render(mergedComponent, props);
        };
    };

    return { Bem, Block, Elem, withMods };
}
