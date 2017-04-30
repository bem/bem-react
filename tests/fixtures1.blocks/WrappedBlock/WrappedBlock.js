import React from 'react';
import Bem, { decl } from 'bem-react-core';

export default decl({
    block : 'WrappedBlock',

    wrap(wrappedBlock) {
        return (
            <Bem block="Wrapper">
                {wrappedBlock}
            </Bem>
        );
    }
});
