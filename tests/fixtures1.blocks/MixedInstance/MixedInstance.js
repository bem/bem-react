import React from 'react';
import { decl } from 'bem-react-core';
import Nested from 'b:Nested';

export default decl({
    block : 'MixedInstance',
    mods({ mod }) {
        return { mod };
    },
    mix({ mod }) {
        return <Nested mod={mod}/>;
    }
});
