import { EntityName } from '@bem/sdk.entity-name';
import { Stringify, stringifyWrapper } from '@bem/sdk.naming.entity.stringify';
import { INamingConvention, react } from '@bem/sdk.naming.presets';
import {
    ClassAttributes,
    Component,
    ComponentClass,
    ConsumerProps,
    createContext,
    createElement,
    CSSProperties,
    ProviderProps,
    ReactElement,
    ReactNode,
    StatelessComponent
} from 'react';

import {
    Attrs,
    BemProps,
    Content,
    IBemPropsExtend,
    IStrictBemjson,
    Mix,
    MixesArray,
    // Modifier,
    ModifierClass,
    Mods
} from './interfaces';
import { isValidModValue, omitBemProps, tokenizeEntity } from './utils/bem';
import { inherits } from './utils/inherits';

let uniqCount = 0;
const bemContext = {
    bemBlock: () => null
};

export type Entity = ReactNode;
export type EntityProps<P = {}> = ClassAttributes<P> & IBemPropsExtend & P;
export type FullEntity = (typeof Block | typeof Elem) & { super_?: AnyEntity };
export type AnyEntity = Partial<FullEntity>;
// export type ModDecl<P = {}> = (props: P) => AnyEntity;

/**
 * Map mods on entites in BEMSDK format and makes classString
 *
 * @see https://github.com/bem/bem-sdk/tree/master/packages/entity-name
 *
 * @param entity object to map
 * @param mods modifiers object
 */
interface IEntityNameBase {
    block: EntityName.BlockName;
    elem?: EntityName.ElementName;
}

function modsToClassStrings(
    entity: IEntityNameBase,
    mods: Mods,
    classNameBuilder: Stringify
) {
    return Object.keys(mods).reduce((validEntities: string[], modName) => {
        if (isValidModValue(mods[modName])) {
            validEntities.push(classNameBuilder({
                ...entity,
                mod: {
                    name: modName,
                    val: mods[modName] as EntityName.ModifierValue
                }
            }));
        }
        return validEntities;
    }, []);
}
/**
 * Compatibility method for supporting elemMods for elems in bemjson
 */
function selectMods({ elemMods = {}, mods = {} }: Partial<IStrictBemjson>): Mods {
    return Object.keys(elemMods).length ? elemMods : mods;
}

/* tslint:disable:no-shadowed-variable */
/**
 * Constructor for stringifier.
 * It returns function wich makes className from BemJson.
 *
 * @see https://github.com/bem/bem-sdk/tree/master/packages/naming.presets
 *
 * @param namingPreset - bem-sdk/naming presets.
 */
export function bemjsonStringify(namingPreset: INamingConvention) {
    return ({ block, elem, mods, elemMods, mix, className }: IStrictBemjson) => {
        const classNameBuilder = stringifyWrapper(namingPreset);
        const modsClassStrings = modsToClassStrings(
            { block, elem },
            selectMods({ elemMods, mods }),
            classNameBuilder
        );

        const classStrings = [classNameBuilder({ block, elem })].concat(modsClassStrings);

        if (mix) {
            const mixes = ([] as MixesArray).concat(mix as MixesArray);

            const mixedEntitiesStore = {} as Record<string, IStrictBemjson>;
            const addMixedToStore = (mixed: IStrictBemjson): void => {
                const { block, elem, mods, elemMods } = mixed;
                const k = tokenizeEntity({ block, elem });

                mixed.mods = selectMods({ elemMods, mods });

                if (mixedEntitiesStore[k]) {
                    mixedEntitiesStore[k].mods = {
                        ...selectMods({ ...mixed, ...mixedEntitiesStore[k] }),
                        ...mixed.mods
                    };
                } else {
                    mixedEntitiesStore[k] = mixed;
                }
            };
            const walkMixes = (mixes: MixesArray): void => {
                mixes.forEach((entity) => {
                    if (entity === undefined) {
                        return;
                    }

                    if (typeof entity === 'string') {
                        classStrings.push(entity);
                    } else if (typeof entity === 'object' && !Object.keys(entity).length) {
                        return;
                    } else {
                        addMixedToStore(entity);

                        walkMixes(([] as MixesArray).concat(entity.mix as MixesArray));
                    }
                });
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
                        if (isValidModValue(mixedMods[name])) {
                            classStrings.push(classNameBuilder({
                                block: mixedBlock,
                                elem: mixedElem,
                                mod: {
                                    name,
                                    val: mixedMods[name] as EntityName.ModifierValue
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
/* tslint:enable:no-shadowed-variable */

export abstract class Anb<P = {}, S = {}> extends Component<P, S> {
    public static childContextTypes = bemContext;
    public static contextTypes = bemContext;
    /**
     * Declares naming convention.
     *
     * @see https://bem.info/methodology/naming-convention/
     */
    public static naming: INamingConvention = react;

    public props: P;

    public getChildContext() {
        const block = this.blockName;
        const elem = this.elemName;
        const contextBlock = this.context.bemBlock;

        return block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined'
            ? { bemBlock: block }
            : {};
    }

    public get blockName(): string | undefined {
        return undefined;
    }

    public get elemName(): string | undefined {
        return undefined;
    }
}

const { Provider, Consumer } = createContext('block');

export type ContextComponent =
    | ReactElement<ProviderProps<string>>
    | ReactElement<ConsumerProps<string>>;

export function Bem({ block, elem, children, forwardRef, tag = 'div', ...props }: BemProps & Attrs): ContextComponent {
    function buildClassName(computedBlock: string) {
        // @ts-ignore (naming is static value)
        return bemjsonStringify(Bem.naming)({
            block: computedBlock,
            elem,
            mods: props.mods,
            elemMods: props.elemMods,
            mix: props.mix,
            className: props.className
        });
    }

    if (elem === undefined && block !== undefined) {
        return createElement(Provider, { value: block }, createElement(tag, {
            ...omitBemProps(props),
            className: buildClassName(block),
            ref: forwardRef
        }, children));
    }

    return createElement(Consumer, null, (contextBlock: string) => {
        return createElement(tag, {
            ...omitBemProps(props),
            className: buildClassName(block || contextBlock),
            ref: forwardRef
        }, children);
    });
}

// @ts-ignore
Bem.naming = react;

export abstract class Block<P = {}, S = {}> extends Anb<EntityProps<P>, S> {
    /**
     * Predicate for entity modifier.
     * Props based condition for applying modifier in runtime.
     *
     * @see https://en.bem.info/methodology/block-modification/#using-a-modifier-to-change-a-block
     */
    public static mod: (props: EntityProps) => boolean;

    public props: EntityProps<P>;
    public state: S;
    /**
     * Block name declaration.
     *
     * @see https://en.bem.info/methodology/key-concepts/#block
     */
    public abstract block: string;
    /**
     * Unique ids storage.
     */
    private __uniqId: Record<string, string>;

    public bemClassName(elem: string, mods?: Mods) {
        return bemClassName(Block.naming)(this.blockName, elem, mods);
    }

    public render(): ReactNode {
        const { props, state } = this;
        const optionalyReplaced = this.replace(props, state);

        return this.wrap(props, state, optionalyReplaced);
    }
    /**
     * Collect properties for className building.
     */
    public getClassNameParams() {
        const { props, state } = this;
        return {
            block: this.blockName,
            mods: this.mods(props, state),
            mix: this.mix(props, state),
            className: this.props.className
        };
    }

    public get blockName() {
        return this.block || this.constructor.name;
    }
    /**
     * HTML tag declaration.
     *
     * @param _p entity props
     * @param _s entity state
     */
    public tag(_p?: EntityProps<P>, _s?: S) {
        return 'div';
    }
    /**
     * HTML attributes declaration.
     *
     * @param _p entity props
     * @param _s entity state
     */
    public attrs(_p?: EntityProps<P>, _s?: S): Attrs<EntityProps<P>> {
        return Object.create(null);
    }
    /**
     * Inline styles declaration.
     *
     * @param _p entity props
     * @param _s entity state
     */
    public style(_p?: EntityProps<P>, _s?: S): CSSProperties {
        return Object.create(null);
    }
    /**
     * Block modifiers declaration.
     * They are going to className.
     *
     * @see https://en.bem.info/methodology/block-modification/#adding-multiple-modifiers
     *
     * @param _p entity props
     * @param _s entity state
     */
    public mods(_p?: EntityProps<P>, _s?: S): Mods {
        return Object.create(null);
    }
    /**
     * Entity mixes declaration.
     * They are going to className.
     *
     * @see https://en.bem.info/methodology/block-modification/#using-a-mix-to-change-a-block
     *
     * @param _p entity props
     * @param _s entity state
     */
    public mix(_p?: EntityProps<P>, _s?: S): Mix {
        return Object.create(null);
    }
    /**
     * Entity content.
     * It'll be inside of current node.
     *
     * @param _p entity props
     * @param _s entity state
     */
    public content(_p?: EntityProps<P>, _s?: S): Content {
        return this.props.children;
    }
    /**
     * Replace current node with whatever you want.
     *
     * @param _p entity props
     * @param _s entity state
     */
    public replace(_p?: EntityProps<P>, _s?: S): Entity {
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
    public wrap(_p?: EntityProps<P>, _s?: S, component?: Entity): Entity {
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
    public generateId(key = 'uniq') {
        this.__uniqId = this.__uniqId || {};
        return this.__uniqId[key] !== undefined
            ? this.__uniqId[key]
            : (this.__uniqId[key] = `${key}${++uniqCount}`);
    }
    /**
     * Makes CSS class by bemjson.
     *
     * @param bemjson bemjson fields
     */
    public stringify(bemjson: IStrictBemjson) {
        return bemjsonStringify(Block.naming)(bemjson);
    }
    /**
     * Resets global counter for unique ids
     *
     * @modifies {uniqCount}
     */
    public resetId() {
        uniqCount = 0;
    }

    /**
     * Renders current node before wrapping and/or replacing.
     */
    private prerender() {
        const { props, state } = this;
        const attrs = this.attrs(props, state);
        const style = this.style(props, state);

        const classNameParams = this.getClassNameParams();

        return createElement(this.tag(props, state), {
            ...{ ...attrs, style : { ...attrs.style, ...style } },
            children: this.content(props, state),
            className: this.stringify(classNameParams)
        });
    }
}

export abstract class Elem<P = {}, S = {}> extends Block<P, S> {
    /**
     * Element name declaration.
     *
     * @see https://en.bem.info/methodology/key-concepts/#element
     */
    public abstract elem: string;

    // @ts-ignore
    public bemClassName(mods: Mods) {
        return bemClassName(Block.naming)(this.blockName, this.elemName, mods);
    }

    public getClassNameParams() {
        return {
            ...super.getClassNameParams(),
            mods: {},
            elem: this.elemName,
            elemMods: this.elemMods(this.props, this.state)
        };
    }

    public get elemName() {
        return this.elem;
    }
    /**
     * Element modifiers declaration.
     * They are going to className.
     *
     * @see https://en.bem.info/methodology/block-modification/#adding-multiple-modifiers
     *
     * @param _p entity props
     * @param _s entity state
     */
    public elemMods(_p?: EntityProps<P>, _s?: S): Mods {
        return Object.create(null);
    }
}

// TODO(yarastqt): remove when typescript add spread/rest higher-order types operator
// https://github.com/Microsoft/TypeScript/issues/10727
// @ts-ignore
export function withMods<B, M1, M2 = {}, M3 = {}, M4 = {}, M5 = {}, M6 = {}, M7 = {}, M8 = {}, M9 = {}>(
    Base: ComponentClass<B>,
    Modifier1: ModifierClass<M1>,
    Modifier2?: ModifierClass<M2>,
    Modifier3?: ModifierClass<M3>,
    Modifier4?: ModifierClass<M4>,
    Modifier5?: ModifierClass<M5>,
    Modifier6?: ModifierClass<M6>,
    Modifier7?: ModifierClass<M7>,
    Modifier8?: ModifierClass<M8>,
    Modifier9?: ModifierClass<M9>
): StatelessComponent<EntityProps<B & M1 & M2 & M3 & M4 & M5 & M6 & M7 & M8 & M9>>;

export function withMods<B, M>(Base: ComponentClass<B>, ...modifiers: ModifierClass<M>[]) {
    return function WithMods(props: EntityProps<B & M>) {
        const mixins = modifiers.reduce((mixinsList: ModifierClass<M>[], modifier: ModifierClass<M>) => {
            if (__DEV__) {
                if (!(Base.prototype instanceof Block)) {
                    throw Error(`Class "${Base.name}" should be extended from Block or Elem`);
                }

                if (!(modifier.prototype instanceof Base)) {
                    throw Error(`Modifier "${modifier.name}" should be extended from "${Base.name}"`);
                }

                if (typeof modifier.mod !== 'function') {
                    throw Error(`Modifier "${modifier.name}" should have mod as function`);
                }
            }

            const predicateResult = modifier.mod(props);

            if (predicateResult) {
                mixinsList.push(modifier);
            }

            return mixinsList;
        }, []);

        const ModifiedComponent = mixins.reduce(inherits, Base);

        return createElement(ModifiedComponent, props);
    };
}

export function bemClassName(naming: INamingConvention = react) {
    const stringify = bemjsonStringify(naming);
    return (block: string, elem?: string, mods?: Mods) => {
        return stringify({ block, elem, mods });
    };
}
