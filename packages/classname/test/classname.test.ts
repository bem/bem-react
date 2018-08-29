import { describe, it } from 'mocha';
import { expect } from 'chai';

import { cn, configure } from '../classname';

const { origin } = require('@bem/sdk.naming.presets');

describe('cn: default', () => {
    it('block', () => {
        const b = cn('Block');
        expect(b()).to.be.eq('Block');
    });

    it('elem', () => {
        const e = cn('Block', 'Elem');
        expect(e()).to.be.eq('Block-Elem');
    });

    describe('modifiers', () => {
        it('block', () => {
            const b = cn('Block');
            expect(b({ modName: true })).to.be.eq('Block_modName');
        });

        it('elem', () => {
            const e = cn('Block', 'Elem');
            expect(e({ modName: true })).to.be.eq('Block-Elem_modName');
        });

        it('more than one', () => {
            const mods = { modName: true, modName2: 'modVal' };
            const b = cn('Block');
            const e = cn('Block', 'Elem');

            expect(b(mods)).to.be.eq('Block_modName Block_modName2_modVal');
            expect(e(mods)).to.be.eq('Block-Elem_modName Block-Elem_modName2_modVal');
        });
    });
});

describe('cn: configurable', () => {
    const cCn = configure(origin);

    it('block', () => {
        const b = cCn('block');
        expect(b()).to.be.eq('block');
    });

    it('elem', () => {
        const e = cCn('block', 'elem');
        expect(e()).to.be.eq('block__elem');
    });

    describe('modifiers', () => {
        it('block', () => {
            const b = cCn('block');
            expect(b({ modName: true })).to.be.eq('block_modName');
        });

        it('elem', () => {
            const e = cCn('block', 'elem');
            expect(e({ modName: true })).to.be.eq('block__elem_modName');
        });

        it('more than one', () => {
            const mods = { modName: true, modName2: 'modVal' };
            const b = cCn('block');
            const e = cCn('block', 'elem');

            expect(b(mods)).to.be.eq('block_modName block_modName2_modVal');
            expect(e(mods)).to.be.eq('block__elem_modName block__elem_modName2_modVal');
        });
    });
});
