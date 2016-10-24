import React from 'react';

export default function(classNameBuilder) {
    return (Tag, attrs = {}, block, elem, mods, mixes, cls, content) => {
        return (
            <Tag
                className={classNameBuilder.stringify(
                    block,
                    elem,
                    mods,
                    classNameBuilder.joinMixes(mixes),
                    cls)}
                {...attrs}>
                    {content}
            </Tag>;
        );
    };
}
