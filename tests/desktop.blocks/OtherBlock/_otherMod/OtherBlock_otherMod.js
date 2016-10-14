import {declMod} from '../../../../';

export default declMod(({ otherMod }) => otherMod, {
    block : 'OtherBlock',
    didMount() {
        this.__base();
        console.log(`${this.block} with otherMod is mounted`);
    }
});
