import { declMod } from 'bem-react-core';

export default declMod({ cancelledMod : '*' }, {
    block : 'MyBlock',
    mods() {
        return { cancelledMod : false };
    }
});
