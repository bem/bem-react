import React from 'react';
import Bem, {decl} from '../../../';

export default decl({
    block : 'WrappedBlock',

    wrap(wrappedBlock) {
        return <Bem block="Wrapper">{wrappedBlock}</Bem>;
    }
});
