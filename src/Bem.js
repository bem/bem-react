import inherit from 'inherit';
import Base from './Base';

export default function(overrideFields={}, overrideStaticFields={}) {
    return inherit(Base, {
        render() {
            let {
                addBemClassName = true,
                block,
                elem,
                mods,
                tag : Tag = 'div',
                mix,
                attrs,
                cls,
                children
            } = this.props;

            if(!elem && !block && this.context.bemBlock) throw Error('Prop elem must be specified');

            const typeOfBlock = typeof block;
            if(typeOfBlock === 'undefined')
                block = this.context.bemBlock;
            /* istanbul ignore next */
            else if(typeOfBlock === 'object')
                block = block.block;
            /* istanbul ignore next */
            else if(typeOfBlock === 'function')
                block = block.prototype.block;

            if(!block) throw Error('Can\'t get block from context');

            return this.__render(addBemClassName, Tag, attrs, block, elem, mods, mix, cls, children);
        },

        ...overrideFields
    }, {
        displayName : 'Bem',

        ...overrideStaticFields
    });
}
