import { B } from 'b_';

export default class ClassNameBuilder {

    constructor(options) {
        this.b_ = B(options);
    }

    stringify(block, elem, mods, mixes, cls) {
        return this.b_(block, elem, mods) +
            (mixes? ' ' + mixes.map(mix => mix?
                this.b_(mix.block || block, mix.elem, mix.mods) : '').join(' ') :
                '') + (cls? ' ' + cls : '');
    }

    joinMixes(mix1, mix2) {
        if(Array.isArray(mix1)) {
            mix2 = mix1[1];
            mix1 = mix1[0];
        }

        if(!mix1 && !mix2) return;

        let mixes = [],
            uniq = {};

        function pushIfUniq(val) {
            uniq[val] || mixes.push(uniq[val] = val);
        }

        mix1 && mix1.forEach(pushIfUniq);
        mix2 && mix2.forEach(pushIfUniq);

        return mixes;
    }

}
