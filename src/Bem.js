import inherit from 'inherit';
import Base from './Base';

export default function(overrideFields={}, overrideStaticFields={}) {
    return inherit(Base, {
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

        ...overrideFields
    }, {
        displayName : 'Bem',

        ...overrideStaticFields
    });
}
