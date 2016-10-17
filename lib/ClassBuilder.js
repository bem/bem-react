import { B } from 'b_'; // TODO: optimize?

export default class ClassBuilder {

    constructor(options) {
        this.stringify = B(options);
    }

    className(block, elem, mods, mixes, cls) {
        return this.stringify(block, elem, mods) +
            (mixes? ' ' + mixes.map(mix => this.stringify(mix.block || block, mix.elem, mix.mods)).join(' ') : '') +
            (cls? ' ' + cls : '');
    }

    mixes(mix1, mix2) {
        if(!mix1 && !mix2) {
            return;
        }

        let mixes = [];

        mix1 && (mixes = [...mixes, ...mix1]);
        mix2 && (mixes = [...mixes, ...mix2]);

        return mixes;
    }

}
