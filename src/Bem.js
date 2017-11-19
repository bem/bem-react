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
    const { Base, classAttribute, Render, PropTypes } = preset;
    const getRenderProps = function(instance, node) {
        const mergedProps = {
            ...node.attrs,
            ...node,
            [classAttribute] : instance.__cnb(node)
        };

        return Object.keys(mergedProps).reduce((props, p) => {
            if(!bemModes[p]) props[p] = mergedProps[p];
            return props;
        }, Object.create(null));;
    };

    return inherit(Base, {
        __constructor() {
            this.__base(...arguments);
            this.__cnb || (this.__cnb = this.__self.__naming());
        },

        getChildContext() {
            const block = this.block || this.props.block,
                elem = this.elem || this.props.elem,
                contextBlock = this.context && this.context.bemBlock;

            if(block && (!elem && contextBlock !== block) || typeof contextBlock === 'undefined')
                return { bemBlock : block };
        },

        render() {
            let node = Object.assign({}, this.props);
            const { bemBlock } = this.context;

            if(!node.elem && !node.block && bemBlock) throw Error('Prop elem must be specified');

            const typeOfBlock = typeof node.block;
            if(typeOfBlock === 'undefined')
                node.block = bemBlock;
            /* istanbul ignore next */
            else if(typeOfBlock === 'object')
                node.block = block.block;
            /* istanbul ignore next */
            else if(typeOfBlock === 'function')
                node.block = block.prototype.block;

            if(!node.block) throw Error('Can\'t get block from context');

            return this.__render(node);
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

        __naming() {
            const str = stringify(this.__dangerouslySetNaming || naming);
            return ({ addBemClassName = true, block, elem, mods, mix, cls }) => {
                if(addBemClassName) {
                    const entities = [{ block, elem }];
                    mods && Object.keys(mods).forEach(name => {
                        const val = mods[name];
                        val && entities.push({ block, elem, mod : { name, val } });
                    });

                    if(mix) {
                        const mixedEntities = [].concat(mix).reduce((uniq, mixed) => {
                            if(!mixed) return uniq;

                            const k = `${mixed.block}$${mixed.elem}`;

                            if(uniq[k]) uniq[k].mods = Object.assign({}, uniq[k].mods, mixed.mods);
                            else uniq[k] = mixed;

                            return uniq;
                        }, {});

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
