import renderTag from './renderTag';

export default function(classNameBuilder) {
    const __render = renderTag(classNameBuilder);
    return ({ block, elem, mods, tag : Tag = 'div', mix, attrs, cls, children }) => {
        const typeOfBlock = typeof block;
        if(typeOfBlock === 'object') {
            block = block.block;
        } else if(typeOfBlock === 'function') {
            block = block.prototype.block;
        }

        return __render(Tag, attrs, block, elem, mods, mix, cls, children);
    };
}
