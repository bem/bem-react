import React from 'react';

export default function(classNameBuilder) {
    return (Tag, attrs = {}, block, elem, mods, mixes, cls, content) => {
        const className = classNameBuilder.stringify(
            block,
            elem,
            mods,
            classNameBuilder.joinMixes(mixes),
            cls
        );
        const tagProps = { className, ...attrs };

        return (
            <Tag {...tagProps}>
                {content}
            </Tag>
        );
    };
}
