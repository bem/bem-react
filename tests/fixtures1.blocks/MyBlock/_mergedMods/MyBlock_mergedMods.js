import { declMod } from 'bem-react-core';

export default declMod({ firstMod : 'first' }, {
    block : 'MyBlock',
    mods() {
        return {
            ...this.__base.call(this, ...arguments),
            secondMod : 'second'
        };
    }
});
