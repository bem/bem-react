import { createElement } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getMountedNode } from './helpers/node';

describe('DisplayName:', () => {

    describe('Bem:', () => {
        it('generates name in runtime', () => {
            expect(getMountedNode(createElement(Bem, { block: 'Block' })).name()).toBe('Bem');
        });
    });

    describe('Block:', () => {
        it('generates name in runtime', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
            }
            expect(getMountedNode(createElement(MyBlock)).name()).toBe('MyBlock');
        });
    });

    describe('Elem:', () => {
        it('generates name in runtime', () => {
            class MyElem extends Elem {
                protected block = 'MyBlock';
                protected elem = 'Shalala';
            }
            expect(getMountedNode(createElement(MyElem)).name()).toBe('MyBlock-Shalala');
        });
    });
});
