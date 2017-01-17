import { declMod } from 'bem-react-core';

export default declMod(({ myModWithVal }) => myModWithVal, {
    block : 'MyBlock',
    mods({ myModWithVal }) {
        return { ...this.__base.apply(this, arguments), myModWithVal };
    }
});
