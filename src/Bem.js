import inherit from 'inherit';
import stringifyClassName from '@bem/sdk.naming.entity.stringify';
import * as Entity from './Entity';

const bemModes = {
    block : 1,
    elem : 1,
    addBemClassName : 1,
    tag : 1,
    attrs : 1,
    mods : 1,
    mix : 1,
    cls : 1
};

export default function({ preset, naming }) {
    const { Base, classAttribute, Render, PropTypes } = preset,
        getRenderProps = function(instance, props) {
            const mergedProps = {
                ...props.attrs,
                ...props,
                [classAttribute] : instance.__cnb(props)
            };

            return Object.keys(mergedProps).reduce((props, p) => {
                if(!bemModes[p]) props[p] = mergedProps[p];
                return props;
            }, Object.create(null));
        },
        resolveMods = entity => entity.elem ? entity.elemMods || entity.mods : entity.mods,
        runtimeNaming = instance => {
            const entityClassName = stringifyClassName(instance.__self.__dangerouslySetNaming || naming);

            return ({ addBemClassName = true, block, mods, elem, elemMods, mix, cls }) => {
                if(addBemClassName) {
                    const resolvedMods = resolveMods({ block, mods, elem, elemMods }),
                        entities = (instance.__self.bases || []).map(key => ({ block : key }))
                            .concat({ block, elem });

                    if(resolvedMods) {
                        const realModsEntities = resolvedMods.__entities || {};
                        for(let modName in resolvedMods) {
                            if(modName === '__entities') continue;

                            if(realModsEntities[modName]) {
                                for(let entity in realModsEntities[modName])
                                    if(resolvedMods[modName]) {
                                        entity = Entity.parse(entity);
                                        entities.push({
                                            block : entity.block,
                                            elem : entity.elem,
                                            mod : { name : modName, val : resolvedMods[modName] }
                                        });
                                    }
                            } else entities.push({
                                block,
                                elem,
                                mod : { name : modName, val : resolvedMods[modName] }
                            });
                        }
                    }

                    if(mix) {
                        const mixedEntities = {},
                            resolveMixed = mixed => {
                                mixed.mods = resolveMods(mixed);

                                const k = Entity.tokenize(mixed);

                                if(mixedEntities[k])
                                    mixedEntities[k].mods = Object.assign(
                                        resolveMods({ ...mixed, ...mixedEntities[k] }), mixed.mods
                                    );
                                else mixedEntities[k] = mixed;
                            },
                            resolveMixes = mixes => {
                                for(let entity of [].concat(mixes))
                                    if(entity) {
                                        if(typeof entity.type === 'function') {
                                            const props = entity.props,
                                                inst = new entity.type(props);

                                            entity = {
                                                block : inst.block,
                                                elem : inst.elem,
                                                mods : inst.mods(props),
                                                mix : [inst.mix(props), inst.addMix(props)]
                                            };
                                        }

                                        resolveMixed(entity);
                                        entity.mix && resolveMixes(entity.mix);
                                    }
                            };

                        resolveMixes(mix);

                        Object.keys(mixedEntities).forEach(k => {
                            const mixed = mixedEntities[k],
                                mixedMods = mixed.mods,
                                mixedBlock = mixed.block || block,
                                mixedElem = mixed.elem;

                            entities.push({ block : mixedBlock, elem : mixedElem });

                            mixedMods && Object.keys(mixedMods).forEach(name => {
                                const val = mixedMods[name];
                                val && entities.push({ block : mixedBlock, elem : mixedElem, mod : { name, val } });
                            });
                        });
                    }

                    cls && entities.push(cls);

                    return entities.map(entity => typeof entity === 'string'?
                        entity : entityClassName(entity)).join(' ');
                }
            };
        };

    return inherit(Base, {
        __constructor() {
            this.__base(...arguments);
            this.__cnb || (this.__cnb = runtimeNaming(this));
        },

        getChildContext() {
            const block = this.block || this.props.block,
                elem = this.elem || this.props.elem,
                contextBlock = this.context && this.context.bemBlock;

            return block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined'?
                { bemBlock : block } :
                {};
        },

        render() {
            let props = Object.assign({}, this.props);
            const { bemBlock } = this.context;

            if(!props.elem && !props.block && bemBlock)
                throw Error('Prop elem must be specified');

            const typeOfBlock = typeof props.block;
            if(typeOfBlock === 'undefined')
                props.block = bemBlock;
            /* istanbul ignore next */
            else if(typeOfBlock === 'object')
                props.block = block.block;
            /* istanbul ignore next */
            else if(typeOfBlock === 'function')
                props.block = block.prototype.block;

            if(!props.block)
                throw Error('Can\'t get block from context');

            return this.__render(props);
        },

        __render(props) {
            return Render(props.tag || 'div', getRenderProps(this, props));
        }
    }, {
        displayName : 'Bem',

        childContextTypes : {
            bemBlock : PropTypes.string
        },

        contextTypes : {
            bemBlock : PropTypes.string
        },

        __displayName({ block, elem }) {
            this.__cnb || (this.__cnb = stringifyClassName(this.__dangerouslySetNaming || naming));
            return this.__cnb({ block, elem });
        }
    });
}
