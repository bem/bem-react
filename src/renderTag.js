import React from 'react';

export default function(classNameBuilder) {
    return (addBemClassName, Tag, attrs = {}, block, elem, mods, mixes, cls, content) => {
        const className = addBemClassName ? classNameBuilder.stringify(
            block,
            elem,
            mods,
            mixes,
            cls
        ) : undefined;

        const tagProps = { className, ...attrs };
        return (
            <Tag {...tagProps}>
                {content}
            </Tag>
        );
    };
}
