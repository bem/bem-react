import React from 'react';
import { Bem, decl } from 'bem-react-core';

export default decl({
    block : 'WrappedBlock',

    wrap(props, state, component) {
        return (
            <Bem block="Wrapper">
                {component}
            </Bem>
        );
    }
});
