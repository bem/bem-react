import { decl } from 'bem-react-core';

export default decl({
    block : 'another-naming-block',
    elem : 'elem',

    mods : {
        try : true
    },

    _naming : {
        elementSeparator : '__',
        modSeparator : '--',
        modValueSeparator : '_'
    }
});
