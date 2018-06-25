import * as React from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getNode } from './helpers/node';

describe('Content:', () => {
    describe('Bem:', () => {
        it('has passed content', () => {
            const wrapper = getNode(
                <Bem block="Block" children="content" />
            );

            expect(wrapper.text()).toBe('content');
        });
    });

    describe('Block', () => {
        it('has passed content', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
            }

            const wrapper = getNode(
                <MyBlock>content</MyBlock>
            );

            expect(wrapper.text()).toBe('content');
        });

        it('has declared and passed content', () => {
            class MyBlock extends Block {
                public block = 'MyBlock';
                public content() {
                    return this.props.children + 'declared';
                }
            }

            const wrapper = getNode(
                <MyBlock>content</MyBlock>
            );

            expect(wrapper.text()).toBe('contentdeclared');
        });
    });
});
