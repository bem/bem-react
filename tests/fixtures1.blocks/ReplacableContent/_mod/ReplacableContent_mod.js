import React from 'react';
import { declMod } from 'bem-react-core';

export default declMod({ mod : true }, {
    block : 'ReplacableContent',

    replace() {
        return <b>replaced</b>;
    }
});
