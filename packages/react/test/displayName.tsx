import * as React from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { mount } from './helpers/node';

describe('DisplayName:', () => {
    describe('Bem:', () => {
        it('generates name in runtime', () => {
            const wrapper = mount(
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

            const wrapper = mount(
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

            const wrapper = mount(
                <MyElem />
            );

            expect(wrapper.name()).toBe('MyBlock-Shalala');
        });
    });
});
