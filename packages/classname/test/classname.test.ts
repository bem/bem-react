import { describe, it } from 'mocha';
import { expect } from 'chai';

import { cn, withNaming } from '../classname';

describe('@bem-react/classname', () => {
    describe('cn', () => {
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
                expect(b({ modName: true })).to.be.eq('Block Block_modName');
            });

            it('elem', () => {
                const e = cn('Block', 'Elem');
                expect(e({ modName: true })).to.be.eq('Block-Elem Block-Elem_modName');
            });

            it('more than one', () => {
                const mods = { modName: true, modName2: 'modVal' };
                const b = cn('Block');
                const e = cn('Block', 'Elem');

                expect(b(mods)).to.be.eq('Block Block_modName Block_modName2_modVal');
                expect(e(mods)).to.be.eq('Block-Elem Block-Elem_modName Block-Elem_modName2_modVal');
            });

            it('empty', () => {
                const b = cn('Block');
                expect(b({})).to.be.eq('Block');
            });

            it('falsy', () => {
                const b = cn('Block');
                expect(b({ modName: false })).to.be.eq('Block');
            });

            it('with falsy', () => {
                const b = cn('Block', 'Elem');
                expect(b({ modName: false, mod: 'val' })).to.be.eq('Block-Elem Block-Elem_mod_val');
            });

            it('zero', () => {
                const b = cn('Block');
                expect(b({ modName: '0' })).to.be.eq('Block Block_modName_0');
            });

            it('undefined', () => {
                const b = cn('Block');
                expect(b({ modName: undefined })).to.be.eq('Block');
            });
        });

        describe('mix', () => {
            it('block', () => {
                const b = cn('Block');
                expect(b(null, ['Mix1', 'Mix2'])).to.be.eq('Block Mix1 Mix2');
            });

            it('block with mods', () => {
                const b = cn('Block');
                expect(b({ theme: 'normal' }, ['Mix'])).to.be.eq('Block Block_theme_normal Mix');
            });

            it('elem', () => {
                const e = cn('Block', 'Elem');
                expect(e(null, ['Mix1', 'Mix2'])).to.be.eq('Block-Elem Mix1 Mix2');
            });

            it('elem with mods', () => {
                const e = cn('Block', 'Elem');
                expect(e({ theme: 'normal' }, ['Mix'])).to.be.eq('Block-Elem Block-Elem_theme_normal Mix');
            });

            it('carry elem', () => {
                const b = cn('Block');
                expect(b('Elem', ['Mix1', 'Mix2'])).to.be.eq('Block-Elem Mix1 Mix2');
            });

            it('carry elem with mods', () => {
                const b = cn('Block');
                expect(b('Elem', { theme: 'normal' }, ['Mix'])).to.be.eq('Block-Elem Block-Elem_theme_normal Mix');
            });

            it('undefined', () => {
                const b = cn('Block');
                expect(b('Elem', null, [undefined])).to.be.eq('Block-Elem');
            });

            it('unique block', () => {
                const b = cn('Block');
                expect(b(null, ['Block'])).to.be.eq('Block');
            });

            it('unique block with mods', () => {
                const b = cn('Block');
                expect(b({ theme: 'normal' }, ['Block Block_size_m'])).to.be.eq('Block Block_theme_normal Block_size_m');
            });

            it('unique elem', () => {
                const b = cn('Block');
                expect(b('Elem', null, ['Block-Elem'])).to.be.eq('Block-Elem');
            });

            it('unique elem with mods', () => {
                const b = cn('Block');
                expect(b('Elem', { theme: 'normal' }, ['Block-Elem Block-Elem_size_m']))
                    .to.be.eq('Block-Elem Block-Elem_theme_normal Block-Elem_size_m');
            });
        });
    });

    describe('withNaming', () => {
        const cCn = withNaming({
            e: '__',
            m: '_',
        });

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
                expect(b({ modName: true })).to.be.eq('block block_modName');
            });

            it('elem', () => {
                const e = cCn('block', 'elem');
                expect(e({ modName: true })).to.be.eq('block__elem block__elem_modName');
            });

            it('more than one', () => {
                const mods = { modName: true, modName2: 'modVal' };
                const b = cCn('block');
                const e = cCn('block', 'elem');

                expect(b(mods)).to.be.eq('block block_modName block_modName2_modVal');
                expect(e(mods)).to.be.eq('block__elem block__elem_modName block__elem_modName2_modVal');
            });

            it('empty', () => {
                const b = cCn('block');
                expect(b({})).to.be.eq('block');
            });

            it('falsy', () => {
                const b = cCn('block');
                expect(b({ modName: false })).to.be.eq('block');
            });

            it('with falsy', () => {
                const b = cCn('block');
                expect(b({ modName: false, mod: 'val' })).to.be.eq('block block_mod_val');
            });

            it('zero', () => {
                const b = cCn('block');
                expect(b({ modName: '0' })).to.be.eq('block block_modName_0');
            });
        });
    });

    describe('carry', () => {
        it('alone', () => {
            const e = cn('Block');
            expect(e('Elem')).to.be.eq('Block-Elem');
        });

        it('with mods', () => {
            const e = cn('Block');
            expect(e('Elem', { modName: true })).to.be.eq('Block-Elem Block-Elem_modName');
        });

        it('with elemMods', () => {
            const e = cn('Block', 'Elem');
            expect(e({ modName: true })).to.be.eq('Block-Elem Block-Elem_modName');
        });
    });
});
