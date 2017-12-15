import React from 'react';
import { Bem, decl } from 'bem-react-core';

export default decl({
    block : 'ReplacedBlock',

    wrap(props, state, component) {
        return (
            <Bem block="Wrapper">
                {component}
            </Bem>
        );
    },

    replace({ text }) {
        return text;
    }
});
