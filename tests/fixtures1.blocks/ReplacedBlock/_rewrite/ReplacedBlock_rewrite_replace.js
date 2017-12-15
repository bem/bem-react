import React from 'react';
import { Bem, declMod } from 'bem-react-core';

export default declMod({ rewrite : 'replace' }, {
    block : 'ReplacedBlock',

    replace() {
        return <Bem block="ReplacedWith"/>;
    }
});
