import { B } from 'b_';

export default class ClassNameBuilder {

    constructor(options) {
        this.b_ = B(options);
    }

    stringify(block, elem, mods, mixes, cls) {
        return this.b_(block, elem, mods) +
            (mixes && mixes.length? ' ' + mixes.map(mix => mix?
                this.b_(mix.block || block, mix.elem, mix.mods) : '').join(' ') :
                '') + (cls? ' ' + cls : '');
    }

    uniqueMixes(mixes) {
        if(!mixes) return;

        const uniqMixes = [],
            uniq = {};

        [].concat(...mixes).forEach(mix => {
            if(!mix) return;
            const hash = `${mix.block}-${mix.elem}`;
            uniq[hash] || uniqMixes.push(uniq[hash] = mix);
        });

        return uniqMixes;
    }

}
