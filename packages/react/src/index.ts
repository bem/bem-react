/* tslint:disable:no-shadowed-variable */
import * as entityStringifier from '@bem/sdk.naming.entity.stringify';

const inherits = (Super, Inherited) => {
    // TODO: log
    Inherited.super_ = Super;
    Object.setPrototypeOf(Inherited.prototype, Super.prototype);
    return Object.setPrototypeOf(Inherited, Super);
};

const resolveHocs = (hocs, props) => hocs.map((hoc) => hoc(props)).filter(Boolean);

const tokenDelim = '$';
const tokenizeEntity = ({ block, elem }: BEMSDK.EntityName): string => `${block}${tokenDelim}${elem}`;
const parseEntityToken = (id: string): BEMSDK.EntityName => {
    const entity = id.split(tokenDelim);
    return { block: entity[0], elem: entity[1] === 'undefined' ? undefined : entity[1] };
};
/**
 * Map mods on entites in BEMSDK format
 * https://github.com/bem/bem-sdk/tree/master/packages/entity-name
 *
 * @param entity - object to map
 * @param mods - modifiers object
 */
const simpleModsToEntities = (entity: BEMSDK.EntityName, mods: BemCore.Mods): BEMSDK.EntityName[] =>
    Object.keys(mods).reduce((entities, modName ) => {
        entities.push({ ...entity, mod: { name: modName, val: mods[modName] } });
        return entities;
    }, []);
/**
 * Constructor for strigifier.
 * It returns function wich makes className from BemJson.
 *
 * @param namingPreset - bem-sdk/naming presets.
 * https://github.com/bem/bem-sdk/tree/master/packages/naming.presets
 */
const bemjsonStringify = (namingPreset) =>
    ({ block, elem, mods, elemMods, mix, className }: Partial<BemCore.BemPureProps>): string => {
        const classNameBuilder = entityStringifier(namingPreset);
        const resolveMods = ({ elemMods = {}, mods = {} }: Partial<BemCore.BemJson>): BemCore.Mods =>
            Object.keys(elemMods).length ? elemMods : mods;
        const entityMods = simpleModsToEntities({ block, elem }, resolveMods({ elemMods, mods }));
        const validModVal = (val): boolean => val && val !== '' && Boolean(val);

        const cls = entityMods
            .filter((entityMod) => validModVal(entityMod.mod.val))
            .reduce((clsParts, entityMod) => {
                clsParts.push(classNameBuilder(entityMod));
                return clsParts;
            }, [classNameBuilder({ block, elem })]);

        const mixes = [].concat(mix);

        if (mixes.length) {
            const mixedEntities = {} as { [key: string]: BemCore.BemJson };
            const resolveMixed = (mixed: BemCore.BemJson): void => {
                const { block, elem, mods, elemMods } = mixed;
                const k = tokenizeEntity({ block, elem });

                mixed.mods = resolveMods({ elemMods, mods });

                if (mixedEntities[k]) {
                    mixedEntities[k].mods = Object.assign(
                        resolveMods({ ...mixed, ...mixedEntities[k] }), mixed.mods
                    );
                } else {
                    mixedEntities[k] = mixed;
                }
            };
            const resolveMixes = (mixes: Array<string | BemCore.BemJson>): void => {
                for (const entity of mixes) {
                    if (entity) {
                        if (typeof entity === 'string') {
                            cls.push(entity);
                        } else {
                            resolveMixed(entity);

                            if (entity.mix) {
                                resolveMixes([].concat(entity.mix));
                            }
                        }
                    }
                }
            };

            resolveMixes(mixes);

            Object.keys(mixedEntities).forEach((k) => {
                const mixed = mixedEntities[k];
                const mixedMods = mixed.mods;
                const mixedBlock = mixed.block || block;
                const mixedElem = mixed.elem;

                cls.push(classNameBuilder({ block : mixedBlock, elem : mixedElem }));

                if (mixedMods) {
                    Object.keys(mixedMods).forEach((name) => {
                        const val = mixedMods[name];
                        if (val) {
                            cls.push(classNameBuilder({ block : mixedBlock, elem : mixedElem, mod : { name, val } }));
                        }
                    });
                }
            });
        }

        if (className) {
            cls.push(className);
        }

        return cls.join(' ');
    };

const bemProps = ['addBemClassName', 'block', 'elem', 'elemMods', 'mix', 'mods', 'tag'];
/**
 * Remove bemProps from result props before rendering
 *
 * @param props - component props
 */
const cleanBemProps = (props: BemCore.BemPureProps) => {
    const newProps = Object.assign({}, props);
    for (const prop of bemProps) {
        delete newProps[prop];
    }
    return newProps;
};
/**
 * Make core instance for any Virtual DOM based framework
 *
 * @param preset - preset for core library, ex: React, Preact and etc.
 */
export function declareBemCore(preset: BemCore.Preset) {
    let uniqCount: number = 0;

    abstract class Anb<P, S> extends preset.Base<P, S> {
        public static childContextTypes = {
            bemBlock: () => null
        };

        public static contextTypes = {
            bemBlock : () => null
        };

        protected stringify = bemjsonStringify(preset.naming);

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

    class Bem<P, S = {}> extends Anb<BemCore.BemPureProps & BemCore.AllHTMLAttributes<P>, S> {
        public static displayName = 'Bem';

        public static defaultProps: Partial<BemCore.BemPureProps> = {
            tag: 'div',
            addBemClassName: true,
            mods: Object.create(null) as BemCore.Mods,
            elemMods: Object.create(null) as BemCore.Mods
        };

        public props: BemCore.BemPureProps & BemCore.AllHTMLAttributes<P>;

        public render() {
            const { addBemClassName, tag, mods, elemMods, mix, className } = this.props;
            let block = this.blockName;
            const elem = this.elemName;

            if (!this.props.elem && !this.props.block && this.context.bemBlock) {
                throw Error('Prop elem must be specified');
            }

            if (typeof block === 'undefined') {
                block = this.context.bemBlock;
            }

            if (!block) {
                throw Error('Can\'t get block from context');
            }

            return preset.render(tag, Object.assign({}, {
                ...cleanBemProps(this.props),
                className: addBemClassName ?
                    this.stringify({ block, elem, mods, elemMods, mix, className }) :
                    undefined
            }));
        }

        protected get blockName(): string {
            return this.props.block;
        }

        protected get elemName(): string {
            return this.props.elem;
        }
    }

    class Block<P = {}, S = {}> extends Anb<BemCore.BemProps<P>, S> {
        public static defaultProps = {};
        public props: BemCore.BemProps<P>;
        public state: S;

        protected addBemClassName: boolean = true;
        protected block: string;

        private __uniqId: { [key: string]: string };

        public render() {
            const { addBemClassName } = this;
            const { className } = this.props;
            const attrs = this.attrs(this.props, this.state);
            const style = this.style(this.props, this.state);

            return preset.render(this.tag(this.props, this.state), Object.assign({}, {
                ...cleanBemProps(this.props),
                ...{ ...attrs, style : { ...attrs.style, ...style } },
                children: this.content(this.props, this.state),
                className: addBemClassName
                    ? this.stringify(this.getClassNameParams())
                    : undefined
            }));
        }

        protected getClassNameParams(): BemCore.BemPureProps {
            return {
                block: this.block,
                mods: this.mods(this.props, this.state),
                mix: this.mix(this.props, this.state),
                className: this.props.className
            };
        }

        protected get blockName(): string {
            return this.block;
        }

        protected tag(props: BemCore.BemProps<P>, state: S): keyof BemCore.Tag {
            return 'div';
        }

        protected attrs(props: BemCore.BemProps<P>, state: S): BemCore.AllHTMLAttributes<P> {
            return Object.create(null);
        }

        protected style(props: BemCore.BemProps<P>, state: S): BemCore.CSSProperties {
            return Object.create(null);
        }

        protected mods(props: BemCore.BemProps<P>, state: S): BemCore.Mods {
            return Object.create(null);
        }

        protected mix(props: BemCore.BemProps<P>, state: S): BemCore.Mix {
            return null;
        }

        protected content(props: BemCore.BemProps<P>, state: S): BemCore.Content | BemCore.Content[] {
            return props.children;
        }
        /**
         * Generates unique id from global counter.
         * Ex: this.generateId() -> 'uniq341'
         *
         * @param key prefix for id string, 'uniq' by default
         */
        protected generateId(key: string = 'uniq') {
            this.__uniqId = this.__uniqId || {};
            return this.__uniqId[key]
                ? this.__uniqId[key]
                : (this.__uniqId[key] = `${key}${++uniqCount}`);
        }
        /**
         * Resets global counter for unqie ids
         */
        protected resetId(): void {
            uniqCount = 0;
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

        protected elemMods(props: BemCore.BemProps<P>, state: S): BemCore.Mods {
            return Object.create(null);
        }
    }

    const mod: BemCore.ModDeclaratorSignature = function(predicate, body) {
        return (props) => predicate(props) ? body : null;
    };

    const withMods: BemCore.WithModsSignature = function(Base, ...hocs) {

        if (Base._withModsAlreadyCalled) {
            throw new Error('You can construct component only once. Call withMods for your new instance.');
        } else {
            Base._withModsAlreadyCalled = true;
        }

        Base.cachedHocs = Base.cachedHocs || [];

        function modsHoc(props) {
            modsHoc.cachedHocs = [...Base.cachedHocs, ...hocs];
            const mixins = resolveHocs(modsHoc.cachedHocs, props);
            // TODO: check props and not rebuild class if all the same
            const mergedComponent = !mixins.length
                ? Base
                : mixins.reduce(inherits, mixins.splice(0, 1)[0]);

            return preset.render(mergedComponent, props);
        }

        // It's life hack to declare static fields for functions
        // We are using ingore here to disable errors for inside
        // functions namespace declaration
        // @ts-ignore
        namespace modsHoc {
            export let cachedHocs: Array<BemCore.ModHoc<any>>;
        }

        return modsHoc;
    };

    return { Bem, Block, Elem, mod, withMods };
}
