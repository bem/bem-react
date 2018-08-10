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
    PureComponent,
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
    ModifierClass,
    Mods
} from './interfaces';
import { omitBemProps, tokenizeEntity } from './utils/bem';
import { inherits } from './utils/inherits';
import { warning } from './utils/asserts';

let uniqCount = 0;

export type EntityProps<P = {}> = ClassAttributes<P> & IBemPropsExtend & P;

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
        if (mods[modName] || mods[modName] === 0) {
            validEntities.push(classNameBuilder({
                ...entity,
                mod: {
                    name: modName,
                    val: mods[modName] === true ? true : String(mods[modName])
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
                        if (mixedMods[name] || mixedMods[name] === 0) {
                            classStrings.push(classNameBuilder({
                                block: mixedBlock,
                                elem: mixedElem,
                                mod: {
                                    name,
                                    val: mixedMods[name] === true ? true : String(mixedMods[name])
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

const { Provider, Consumer } = createContext('block');

export type ContextComponent =
    | ReactElement<ProviderProps<string>>
    | ReactElement<ConsumerProps<string>>;

export type IBemProps = BemProps & Attrs;

export class Bem extends PureComponent<IBemProps> {
    /**
     * Declares naming convention.
     *
     * @see https://bem.info/methodology/naming-convention
     */
    protected naming = react;

    /**
     * Makes CSS class from bemjson.
     *
     * @param bemjson bemjson fields
     */
    public buildClassName(bemjson: IStrictBemjson) {
        return bemjsonStringify(this.naming)(bemjson);
    }

    public render() {
        const { elem, block } = this.props;

        if (elem === undefined && block !== undefined) {
            return createElement(Provider, { value: block }, this.getElement(block));
        }

        return createElement(Consumer, null, (contextBlock: string) => {
            return this.getElement(block || contextBlock);
        });
    }

    private getElement(block: string) {
        const { tag = 'div', forwardRef, children } = this.props;
        const className = this.buildClassName({ ...this.classNameParams, block });

        return createElement(tag, {
            ...omitBemProps(this.props),
            className,
            ref: forwardRef
        }, children)
    }

    /**
     * Get properties for className building.
     */
    private get classNameParams() {
        return {
            elem: this.props.elem,
            mods: this.props.mods,
            elemMods: this.props.elemMods,
            mix: this.props.mix,
            className: this.props.className
        };
    }
}

export abstract class Block<P = {}, S = {}> extends Component<EntityProps<P>, S> {
    /**
     * Predicate for entity modifier.
     * Props based condition for applying modifier in runtime.
     *
     * @see https://en.bem.info/methodology/block-modification/#using-a-modifier-to-change-a-block
     *
     * @param props entity props
     */
    public static mod: (props: any) => boolean; // any because no way to use dynamic generic in static field

    public props: EntityProps<P>;
    public state: S;
    /**
     * Block name declaration.
     *
     * @see https://en.bem.info/methodology/key-concepts/#block
     */
    public abstract block: string;
    /**
     * Declares naming convention.
     *
     * @see https://bem.info/methodology/naming-convention
     */
    protected naming = react;
    /**
     * Unique ids storage.
     */
    private __uniqId: Record<string, string>;
    /**
     * Counter for calling attach reference.
     */
    private __attachForwardRefCounter: number;

    public constructor(props: EntityProps<P>) {
        super(props);

        this.__attachForwardRefCounter = 0;
        this.attachForwardRef = this.attachForwardRef.bind(this);
    }

    public bemClassName(...args: (string | Mods)[]) {
        return bemClassName(this.naming)(this.block, args[0] as string, args[1] as Mods);
    }

    public render(): ReactNode {
        const tag = this.tag(this.props, this.state);
        const children = this.content(this.props, this.state);
        const attrs = this.attrs(this.props, this.state);
        const style = this.style(this.props, this.state);
        const extendedStyles = { ...attrs.style, ...style };

        return this.prerender(tag, {
            ...attrs,
            ref: this.attachForwardRef,
            style: extendedStyles
        }, children);
    }
    /**
     * Attach forward reference.
     *
     * @param node html element
     */
    public attachForwardRef(node: HTMLElement) {
        if (this.props.forwardRef === undefined) {
            return;
        }

        this.__attachForwardRefCounter++;

        // if node is null then detach reference, otherwise attach
        if (node === null || this.__attachForwardRefCounter === 1) {
            if (typeof this.props.forwardRef === 'function') {
                this.props.forwardRef(node);
            } else if (typeof this.props.forwardRef === 'object') {
                // @ts-ignore (property current readonly exclusively for an outer world)
                this.props.forwardRef.current = node;
            } else if (__DEV__) {
                warning(
                    false,
                    `Unexpected ref object provided for ${this.constructor.name}. ` +
                        `Use either a ref-setter function or React.createRef().`
                );
            }
        }

        if (__DEV__) {
            warning(
                node === null || this.__attachForwardRefCounter <= 2,
                `Function attachForwardRef is called at more than one node.`
            );
        }
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
     * Makes CSS class from bemjson.
     *
     * @param bemjson bemjson fields
     */
    public buildClassName(bemjson: IStrictBemjson) {
        return bemjsonStringify(this.naming)(bemjson);
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
     * Get properties for className building.
     *
     * @internal
     */
    protected get classNameParams() {
        return {
            block: this.block,
            mods: this.mods(this.props, this.state),
            mix: this.mix(this.props, this.state),
            className: this.props.className
        };
    }
    /**
     * Renders the current node with context wrapper.
     *
     * @internal
     *
     * @param tag html tag
     * @param extendedAttributes html attributes
     * @param children react children node
     */
    protected prerender(tag: string, extendedAttributes: object, children: ReactNode): ContextComponent {
        const className = this.buildClassName(this.classNameParams);
        const providerChildren = createElement(tag, { ...extendedAttributes, className }, children);

        return createElement(Provider, { value: this.block }, providerChildren);
    }
}

export abstract class Elem<P = {}, S = {}> extends Block<P, S> {
    public block: string;
    /**
     * Element name declaration.
     *
     * @see https://en.bem.info/methodology/key-concepts/#element
     */
    public abstract elem: string;

    public bemClassName(...args: (string | Mods)[]) {
        return typeof args[0] === 'string'
            ? bemClassName(this.naming)(this.block, args[0] as string, args[1] as Mods)
            : bemClassName(this.naming)(this.block, this.elem, args[0] as Mods);
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
    /**
     * Get properties for className building.
     *
     * @override
     * @internal
     */
    protected get classNameParams() {
        return {
            ...super.classNameParams,
            mods: {},
            elem: this.elem,
            elemMods: this.elemMods(this.props, this.state)
        };
    }
    /**
     * Renders the current node with context wrapper.
     *
     * @override
     * @internal
     *
     * @param tag html tag
     * @param extendedAttributes html attributes
     * @param children react children node
     */
    protected prerender(tag: string, extendedAttributes: object, children: ReactNode): ContextComponent {
        return createElement(Consumer, null, (contextBlockName: string) => {
            const computedBlock = this.block || contextBlockName;
            const className = this.buildClassName({ ...this.classNameParams, block: computedBlock });

            return createElement(tag, { ...extendedAttributes, className }, children);
        });
    }
}

// TODO(yarastqt): remove when typescript add spread/rest higher-order types operator
// https://github.com/Microsoft/TypeScript/issues/10727
// @ts-ignore
export function withMods<
    B, M1,
    M2 = {}, M3 = {}, M4 = {}, M5 = {}, M6 = {}, M7 = {}, M8 = {}, M9 = {}, M10 = {},
    M11 = {}, M12 = {}, M13 = {}, M14 = {}, M15 = {}, M16 = {}, M17 = {}, M18 = {}, M19 = {}, M20 = {}
>(
    Base: ComponentClass<B>,
    Modifier1: ModifierClass<M1>,
    Modifier2?: ModifierClass<M2>,
    Modifier3?: ModifierClass<M3>,
    Modifier4?: ModifierClass<M4>,
    Modifier5?: ModifierClass<M5>,
    Modifier6?: ModifierClass<M6>,
    Modifier7?: ModifierClass<M7>,
    Modifier8?: ModifierClass<M8>,
    Modifier9?: ModifierClass<M9>,
    Modifier10?: ModifierClass<M10>,
    Modifier11?: ModifierClass<M11>,
    Modifier12?: ModifierClass<M12>,
    Modifier13?: ModifierClass<M13>,
    Modifier14?: ModifierClass<M14>,
    Modifier15?: ModifierClass<M15>,
    Modifier16?: ModifierClass<M16>,
    Modifier17?: ModifierClass<M17>,
    Modifier18?: ModifierClass<M18>,
    Modifier19?: ModifierClass<M19>,
    Modifier20?: ModifierClass<M20>
): StatelessComponent<EntityProps<
    M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | M9 | M10 |
    M11 | M12 | M13 | M14 | M15 | M16 | M17 | M18 | M19 | M20
>>;

export function withMods<B, M>(Base: ComponentClass<B>, ...modifiers: ModifierClass<M>[]) {
    return function WithMods(props: EntityProps<B & M>) {
        const mixins = modifiers.reduce((mixinsList: ModifierClass<M>[], modifier: ModifierClass<M>) => {
            if (__DEV__) {
                if (!(Base.prototype instanceof Block)) {
                    throw Error(`Class "${Base.name}" should be extended from Block or Elem`);
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
