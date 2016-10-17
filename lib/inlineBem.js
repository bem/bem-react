import React from 'react';

export default function(classBuilder) {
    return ({
        block, elem, mods, tag : Tag = 'div', mix, attrs, cls, children
    }) => {
        const typeOfBlock = typeof block;
        if(typeOfBlock === 'object') {
            block = block.block;
        } else if(typeOfBlock === 'function') {
            block = block.prototype.block;
        }

        const className = classBuilder.className(
            block, elem, mods, classBuilder.mixes(mix), cls
        );

        return (
            <Tag className={className} {...attrs}>
                {children}
            </Tag>
        );
    }
}
