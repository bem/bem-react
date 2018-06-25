import * as React from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getMountedNode } from './helpers/node';

describe('DisplayName:', () => {
    describe('Bem:', () => {
        it('generates name in runtime', () => {
            const wrapper = getMountedNode(
                <Bem block="Block" />
            );

            expect(wrapper.name()).toBe('Bem');
        });
    });

    describe('Block:', () => {
        it('generates name in runtime', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
            }

            const wrapper = getMountedNode(
                <MyBlock />
            );

            expect(wrapper.name()).toBe('MyBlock');
        });
    });

    describe('Elem:', () => {
        it('generates name in runtime', () => {
            class MyElem extends Elem {
                public static displayName = 'MyBlock-Shalala';
                public block = 'MyBlock';
                public elem = 'Shalala';
            }

            const wrapper = getMountedNode(
                <MyElem />
            );

            expect(wrapper.name()).toBe('MyBlock-Shalala');
        });
    });
});
