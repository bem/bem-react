import {declMod} from '../../../../';

export default declMod(({ myModWithVal }) => myModWithVal, {
    block : 'MyBlock',
    mods({ myModWithVal }) {
        return { ...this.__base.apply(this, arguments), myModWithVal };
    }
});
