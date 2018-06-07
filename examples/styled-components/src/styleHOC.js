import React from 'react';

export default style => Component => {
    const SC = props => <Component cls={props.className} {...props}/>;
    return style(SC);
};
