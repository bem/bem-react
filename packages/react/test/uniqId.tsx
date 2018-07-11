import * as React from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getMountedNode } from './helpers/node';

describe('UniqId:', () => {
    it('generates unique id', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';

            public attrs() {
                return { id: this.generateId() };
            }
        }

        const wrapper = getMountedNode(
            <MyBlock />
        );

        expect(wrapper.prop('id')).toMatch(/uniq\d+$/);
    });

    it('resets id counter', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';

            constructor(props: any) {
                super(props);
                this.resetId();
            }

            public attrs() {
                return { id: this.generateId() };
            }
        }

        const wrapper = getMountedNode(
            <MyBlock />
        );

        expect(wrapper.prop('id')).toBe('uniq1');
    });
});
