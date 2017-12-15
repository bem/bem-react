import React from 'react';
import { Bem, declMod } from 'bem-react-core';

export default declMod({ another : 'way' }, {
    block : 'WrappedBlock',

    wrap() {
        return (
            <Bem block="WrapperInMod">
                {this.__base(...arguments)}
            </Bem>
        );
    }
});
