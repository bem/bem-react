import React from 'react';

export default cnb => node =>
    React.createElement(node.tag || 'div', {
        className : cnb.str(node),
        ...node.attrs
    }, node.children);
