import { createElement } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getNode } from './helpers/node';

describe('Content:', () => {
    describe('Bem:', () => {
        it('has passed content', () => {
            expect(getNode(createElement(Bem, {
                block: 'Block',
                children: 'content'
            })).text()).toBe('content');
        });
    });

    describe('Block', () => {
        it('has passed content', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
            }
            expect(getNode(createElement(MyBlock, {
                children: 'content'
            })).text()).toBe('content');
        });

        it('has declared and passed content', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected content() {
                    return this.props.children + 'declared';
                }
            }
            expect(getNode(createElement(MyBlock, {
                children: 'content'
            })).text()).toBe('contentdeclared');
        });
    });
});
