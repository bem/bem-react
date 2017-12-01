import inherit from 'inherit';
import stringify from '@bem/sdk.naming.entity.stringify';

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
        };

    return inherit(Base, {
        __constructor() {
            this.__base(...arguments);
            this.__cnb || (this.__cnb = this.__self.__naming(this));
        },

        getChildContext() {
            const block = this.block || this.props.block,
                elem = this.elem || this.props.elem,
                contextBlock = this.context.bemBlock;

            return block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined'?
                { bemBlock : block } :
                {};
        },

        render() {
            let props = Object.assign({}, this.props);
            const { bemBlock } = this.context;

<<<<<<< HEAD
            if(!node.elem && !node.block && bemBlock)
                throw new Error('Prop elem must be specified');
=======
            if(!props.elem && !props.block && bemBlock) throw Error('Prop elem must be specified');
>>>>>>> wip wip wip

            const typeOfBlock = typeof props.block;
            if(typeOfBlock === 'undefined')
                props.block = bemBlock;
            /* istanbul ignore next */
            else if(typeOfBlock === 'object')
                props.block = block.block;
            /* istanbul ignore next */
            else if(typeOfBlock === 'function')
                props.block = block.prototype.block;

<<<<<<< HEAD
            if(!node.block)
                throw new Error('Can\'t get block from context');
=======
            if(!props.block) throw Error('Can\'t get block from context');
>>>>>>> wip wip wip

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

        __naming(instance) {
            const str = stringify(this.__dangerouslySetNaming || naming),
                getMods = entity => entity.elem ? entity.elemMods || entity.mods : entity.mods;

            return function({ addBemClassName = true, block, mods, elem, elemMods, mix, cls }) {
                if(addBemClassName) {
                    const realMods = getMods({ block, mods, elem, elemMods }),
                        entities = [];

                    instance && instance.__self.bases.forEach(key => entities.push({ block : key }));

                    entities.push({ block, elem });

                    if(realMods) {
                        const realModsEntities = realMods.__entities;
                        for(let modName in realMods) {
                            if(modName === '__entities') continue;

                            for(let entity in realModsEntities[modName])
                                if(realMods[modName])
                                    entities.push({
                                        block : entity,
                                        mod : { name : modName, val : realMods[modName] }
                                    });
                        }
                    }

                    if(mix) {
                        const mixedEntities = {},
                            resolveMixed = mixed => {
                                mixed.mods = getMods(mixed);

                                const k = `${mixed.block}$${mixed.elem}`;

                                if(mixedEntities[k])
                                    mixedEntities[k].mods = Object.assign(
                                        getMods({ ...mixed, ...mixedEntities[k] }), mixed.mods
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
                        entity : str(entity)).join(' ');
                }
            };
        },

        __displayName({ block, elem }) {
            this.__cnb || (this.__cnb = this.__naming());
            return this.__cnb({ block, elem });
        }
    });
}
