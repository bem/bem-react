import { B } from 'b_';

export default class ClassNameBuilder {

    constructor(options) {
        this.b_ = B(options);
    }

    stringify(block, elem, mods, mixes, cls) {
        const mixesCls = this.uniqueMixes(block, mixes);
        return this.b_(block, elem, mods) +
            (mixesCls && mixesCls.length? ` ${mixesCls.join(' ')}` : '') +
            (cls? ` ${cls}` : '');
    }

    uniqueMixes(block, mixes) {
        if(!mixes) return;

        const uniqMixes = [],
            uniq = {};

        [].concat(...mixes).forEach(mix => {
            if(!mix) return;
            this.b_(mix.block || block, mix.elem, mix.mods).split(' ').forEach(m => {
                uniq[m] || uniqMixes.push(uniq[m] = m);
            });
        });

        return uniqMixes;
    }

}
