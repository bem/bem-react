/* tslint:disable:no-shadowed-variable */
/// <reference types="@bem/sdk.entity-name" />

import * as React from 'react';

const entityStringifier = require('@bem/sdk.naming.entity.stringify');

// TODO(yarastqt): move to project assembly (rollup or webpack)
const __DEV__ = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';

// React dependant types start -------------------------------------------
export type Attrs<T = {}> = React.AllHTMLAttributes<T> & React.ClassAttributes<T>;
export type Style = React.CSSProperties;

export interface IPreset {
    Base: typeof React.Component;
    render: typeof React.createElement;
    naming: INamingPreset;
}
export type Tag = keyof React.ReactHTML;
export type Entity = React.ReactNode;
export type SFC<P> = React.SFC<P>;
export type BaseContent = undefined | null | string | number | JSX.Element | Entity;
// TODO: fix after https://github.com/bem/bem-sdk/issues/310
type ModifierValue = string | boolean
export type EntityProps<P = {
    [key: string]: ModifierValue;
}> = React.ClassAttributes<P> & IBemPropsExtend & P;
// React dependant types end --------------------------------------------

/**
 * BEM naming preset.
 * Package: @bem/sdk.naming
 */
export interface INamingPreset {
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

export type Mods = Record<BEMSDK.EntityName.ModifierName, ModifierValue | boolean>;
export type Mix = string | IBemJson | MixesArray;
export type MixesArray = Array<string | IStrictBemJson>;
export interface IBemJson {
    tag?: Tag;
    block?: string;
    mods?: Mods;
    mix?: Mix;
    elem?: string;
    elemMods?: Mods;
}
export type Content = BaseContent | BaseContent[];
export interface IBemPropsExtend {
    className?: string;
    children?: Content;
}
export type BemProps = IBemJson & IBemPropsExtend;
export interface IStrictBemJson extends BemProps {
    block: string;
}

type ClassNameBuilderSignature =  (entity: BEMSDK.EntityName.Options) => string;

/**
 * Makes unique token based on block and/or elem fields
 */
function tokenizeEntity({ block, elem }: BEMSDK.EntityName.Options): string {
    return `${block}$${elem}`;
}
/**
 * Map mods on entites in BEMSDK format and makes classString
 * https://github.com/bem/bem-sdk/tree/master/packages/entity-name
 *
 * @param entity object to map
 * @param mods modifiers object
 */
interface IEntityNameBase {
    block: BEMSDK.EntityName.BlockName;
    elem?: BEMSDK.EntityName.ElementName;
}
function modsToClassStrings(
    entity: IEntityNameBase,
    mods: Mods,
    classNameBuilder: ClassNameBuilderSignature
): string[] {
    return Object.keys(mods).reduce((validEntities: string[], modName) => {
        if (isValidModVal(mods[modName])) {
            validEntities.push(classNameBuilder({
                ...entity,
                mod: {
                    name: modName,
                    // TODO: fix after https://github.com/bem/bem-sdk/issues/310
                    val: mods[modName] as ModifierValue & BEMSDK.EntityName.ModifierValue
                }
            }));
        }
        return validEntities;
    }, []);
}
/**
 * Compatibility method for supporting elemMods for elems in bemjson
 */
function selectMods({ elemMods = {}, mods = {} }: Partial<IStrictBemJson>): Mods {
    return Object.keys(elemMods).length ? elemMods : mods;
}
/**
 * Check falsy values in modifiers values
 */
type PossibleModVal = null | string | boolean | undefined | number;
function isValidModVal(val: PossibleModVal): boolean {
    return val && val !== '' ? true : false;
}
/**
 * Constructor for strigifier.
 * It returns function wich makes className from BemJson.
 *
 * @param namingPreset - bem-sdk/naming presets.
 * https://github.com/bem/bem-sdk/tree/master/packages/naming.presets
 */
function bemjsonStringify(namingPreset: INamingPreset) {
    return ({ block, elem, mods, elemMods, mix, className }: IStrictBemJson): string => {
        const classNameBuilder: ClassNameBuilderSignature = entityStringifier(namingPreset);
        const modsClassStrings = modsToClassStrings(
            { block, elem },
            selectMods({ elemMods, mods }),
            classNameBuilder
        );

        const classStrings = [classNameBuilder({ block, elem })].concat(modsClassStrings);

        if (mix) {
            const mixes = ([] as MixesArray).concat(mix as MixesArray);

            const mixedEntitiesStore = {} as Record<string, IStrictBemJson>;
            const addMixedToStore = (mixed: IStrictBemJson): void => {
                const { block, elem, mods, elemMods } = mixed;
                const k = tokenizeEntity({ block, elem });

                mixed.mods = selectMods({ elemMods, mods });

                if (mixedEntitiesStore[k]) {
                    mixedEntitiesStore[k].mods = Object.assign(
                        selectMods({ ...mixed, ...mixedEntitiesStore[k] }),
                        mixed.mods
                    );
                } else {
                    mixedEntitiesStore[k] = mixed;
                }
            };
            const walkMixes = (mixes: MixesArray): void => {
                for (const entity of mixes) {
                    if (entity === undefined) {
                        continue;
                    }

                    if (typeof entity === 'string') {
                        classStrings.push(entity);
                    } else if (typeof entity === 'object' && !Object.keys(entity).length) {
                        continue;
                    } else {
                        addMixedToStore(entity);

                        walkMixes(([] as MixesArray).concat(entity.mix as MixesArray));
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
                                mod: {
                                    name,
                                    // TODO: fix after https://github.com/bem/bem-sdk/issues/310
                                    val: mixedMods[name] as ModifierValue & BEMSDK.EntityName.ModifierValue
                                }
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
    const newProps = {} as { [key: string]: any };
    for (const prop in props) {
        if (!bemProps.includes(prop)) {
            newProps[prop] = props[prop as keyof BemProps];
        }
    }
    return newProps;
}
/**
 * Make core instance for any Virtual DOM based framework
 *
 * @param preset preset for core library, ex: React, Preact and etc.
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

        protected get blockName(): string | undefined {
            return undefined;
        }

        protected get elemName(): string | undefined {
            return undefined;
        }
        // @ts-ignore
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

        public static defaultProps: BemProps = {
            tag: 'div',
            mods: Object.create(null),
            elemMods: Object.create(null)
        };

        public props: BemProps & Attrs<P>;

        public render() {
            const { tag, mods, elemMods, mix, className } = this.props;
            let block = this.blockName as BEMSDK.EntityName.BlockName;
            const elem = this.elemName;

            if (typeof block === 'undefined') {
                block = this.context.bemBlock;
            }

            if (__DEV__) {
                if (!this.props.elem && !this.props.block && this.context.bemBlock) {
                    throw new Error('Prop elem must be specified');
                }

                if (!block) {
                    throw new Error('Prop block must be specified');
                }
            }

            return preset.render(tag as 'div', {
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

        protected get blockName() {
            return this.props.block;
        }

        protected get elemName() {
            return this.props.elem;
        }
    }

    class Block<P = {}, S = {}> extends Anb<EntityProps<P>, S> {
        public static defaultProps = {};
        public static displayName: string;
        /**
         * Predicate for entity modifier.
         * Props based condition for applying modifier in runtime.
         * @see https://en.bem.info/methodology/block-modification/#using-a-modifier-to-change-a-block
         */
        public static mod: EntityProps | ((props: EntityProps) => boolean)

        public props: EntityProps<P>;
        public state: S;
        /**
         * Block name declaration.
         * @see https://en.bem.info/methodology/key-concepts/#block
         */
        protected block: string;
        /**
         * Unique ids storage.
         */
        private __uniqId: Record<string, string>;

        public render() {
            const { props, state } = this;
            const optionalyReplaced = this.replace(props, state);

            return this.wrap(props, state, optionalyReplaced);
        }
        /**
         * Collect properties for className building.
         */
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
        /**
         * HTML tag declaration.
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected tag(_p: EntityProps<P>, _s: S): Tag {
            return 'div';
        }
        /**
         * HTML attributes declaration.
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected attrs(_p: EntityProps<P>, _s: S): Attrs<EntityProps<P>> {
            return Object.create(null);
        }
        /**
         * Inline styles declaration.
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected style(_p: EntityProps<P>, _s: S): Style {
            return Object.create(null);
        }
        /**
         * Block modifiers declaration.
         * They are going to className.
         * @see https://en.bem.info/methodology/block-modification/#adding-multiple-modifiers
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected mods(_p: EntityProps<P>, _s: S): Mods {
            return Object.create(null);
        }
        /**
         * Entity mixes declaration.
         * They are going to className.
         * @see https://en.bem.info/methodology/block-modification/#using-a-mix-to-change-a-block
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected mix(_p: EntityProps<P>, _s: S): Mix {
            return Object.create(null);
        }
        /**
         * Entity content.
         * It'll be inside of current node.
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected content(_p: EntityProps<P>, _s: S): Content {
            return this.props.children;
        }
        /**
         * Replace current node with whatever you want.
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected replace(_p: EntityProps<P>, _s: S): Entity {
            return this.prerender();
        }
        /**
         * Wrap current node with whatever you want,
         * HOCs for example.
         *
         * @param _p entity props
         * @param _s entity state
         * @param component current node
         */
        protected wrap(_p: EntityProps<P>, _s: S, component: Entity): Entity {
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
        /**
         * Generates displayName for current entity.
         * I'll be displayed in DevTools.
         */
        protected displayName(): void {
            Block.displayName = stringify({
                block: this.blockName
            });
        }
        /**
         * Renders current node before wrapping and/or replacing.
         */
        private prerender() {
            const { props, state } = this;
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
        /**
         * Element name declaration.
         * @see https://en.bem.info/methodology/key-concepts/#element
         */
        protected elem: string;

        protected getClassNameParams() {
            return {
                ...super.getClassNameParams(),
                mods: {},
                elem: this.elemName,
                elemMods: this.elemMods(this.props, this.state)
            };
        }

        protected get elemName() {
            return this.elem;
        }
        /**
         * Element modifiers declaration.
         * They are going to className.
         * @see https://en.bem.info/methodology/block-modification/#adding-multiple-modifiers
         *
         * @param _p entity props
         * @param _s entity state
         */
        protected elemMods(_p: EntityProps<P>, _s: S): Mods {
            return Object.create(null);
        }

        protected displayName(): void {
            Block.displayName = stringify({
                block: this.blockName,
                elem: this.elemName
            });
        }
    }

    type FullEntity = (typeof Block | typeof Elem) & { super_?: AnyEntity };
    type AnyEntity = Partial<FullEntity>;
    type ModDecl<P = {}> = (props: P) => AnyEntity;

    function inherits(Super: AnyEntity, Inherited: AnyEntity): AnyEntity {
        let newBase = Super;

        if (Super.prototype && Inherited.prototype) {
            Inherited.super_ = Super;
            Object.setPrototypeOf(Inherited.prototype, Super.prototype);
            newBase = Object.setPrototypeOf(Inherited, Super);
        }

        return newBase;
    }

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

                if (__DEV__) {
                    if (!EntityClass.mod) {
                        throw Error(
                            'You can use only modifiers for applying to base entity. ' +
                            'Looks like you are passing Block or Elem instead.'
                        );
                    }
                }

                if (typeof EntityClass.mod === 'function') {
                    if (EntityClass.mod(props)) {
                        mixins.push(EntityClass);
                    }
                } else {
                    const matched = Object
                        .keys(props)
                        .every((prop) => {
                            if (EntityClass.mod !== undefined && typeof EntityClass.mod === 'object') {
                                // Add this checking because props count may be more than keys of the predicate
                                // and if keys of predicate do not exist skip this iteration
                                if (EntityClass.mod[prop] === undefined) {
                                    return true;
                                }
                                return props[prop] === EntityClass.mod[prop];
                            }
                            return false;
                        });

                    if (matched) {
                        mixins.push(EntityClass);
                    }
                }

                return mixins;
            }, []);

            const mergedComponent = !mixins.length
                ? Base
                : mixins.reduce(inherits, mixins.splice(0, 1)[0]);

            return preset.render(mergedComponent as FullEntity, props);
        };
    };

    return { Bem, Block, Elem, withMods };
}
