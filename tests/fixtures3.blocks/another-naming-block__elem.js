import { decl } from 'bem-react-core';
import naming from '@bem/sdk.naming.presets';

export default decl({
    block : 'another-naming-block',
    elem : 'elem',

    mods : { try : true }
}, {
    __dangerouslySetNaming : naming['two-dashes']
});
