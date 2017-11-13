import { declMod } from 'bem-react-core';
import 'b:BaseBlock m:baseMod';

export default declMod({ baseMod : true }, {
    block : 'ExtendedBlock',
    addMix() {
        return { block : 'MixedBlock' };
    }
}, {
});
