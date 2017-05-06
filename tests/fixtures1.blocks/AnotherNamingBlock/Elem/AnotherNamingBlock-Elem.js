import { decl } from 'bem-react-core';

export default decl({
    block : 'another-naming-block',
    elem : 'elem',

    mods : {
        try : true
    },

    __dengerouslyNamingSettings : {
        elementSeparator : '__',
        modSeparator : '--',
        modValueSeparator : '_'
    }
});
