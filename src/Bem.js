import inherit from 'inherit';

import Base from './Base';

export default function(overrideFields={}, overrideStaticFields={}) {
    return inherit(Base, {
        render() {
            let node = Object.assign({}, this.props);
            const { bemBlock } = this.context;

            if(!node.elem && !node.block && bemBlock)
                throw Error('Prop elem must be specified');

            switch(typeof node.block) {
            case 'undefined':
                node.block = bemBlock;
                break;
            /* istanbul ignore next */
            case 'object':
                node.block = node.block.block;
                break;
            /* istanbul ignore next */
            case 'function':
                node.block = node.block.prototype.block;
                break;
            }

            if(!node.block)
                throw Error('Can\'t get block from context');

            return this.__render(node);
        },

        ...overrideFields
    }, {
        displayName : 'Bem',

        ...overrideStaticFields
    });
}
