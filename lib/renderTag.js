import React from 'react';

export default function(classNameBuilder) {
    return (
        Tag, attrs = {}, block, elem, mods, mixes, cls, content
    ) => {
        const mix = classNameBuilder.joinMixes.apply(this, [].concat(mixes)),
            className = classNameBuilder.stringify(
                block, elem, mods, mix, cls
            );

        return <Tag className={className} {...attrs}>{content}</Tag>;
    };
}
