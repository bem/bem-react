import {declMod} from 'bem-react-core';

export default declMod(({ myMod }) => myMod, {
    block : 'MyBlock',
    mods(props) {
        return { ...this.__base(props), myMod: true };
    },
    onClick() {
        this.__base.apply(this, arguments);
        console.log('with myMod');
    },
    didMount() {
        this.__base();
        console.log(`${this.block} with myMod is mounted`);
    }
});
