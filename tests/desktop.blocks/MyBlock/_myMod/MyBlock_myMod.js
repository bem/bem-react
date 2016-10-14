import {declMod} from '../../../../';

export default declMod(({ myMod }) => myMod, {
    block : 'MyBlock',
    mods({ myMod }) {
        return { ...this.__base.apply(this, arguments), myMod };
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
