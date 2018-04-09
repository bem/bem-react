import { getNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Bem, Block, render } = preset;

    describe('Content:', () => {
        describe('Bem:', () => {
            it('has passed content', () => {
                expect(getNode(render(Bem, {
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
                expect(getNode(render(MyBlock, {
                    children: 'content'
                })).text()).toBe('content');
            });

            it('has declared and passed content', () => {
                class MyBlock extends Block {
                    protected block = 'MyBlock';
                    protected content({ children }) {
                        return children + 'declared';
                    }
                }
                expect(getNode(render(MyBlock, {
                    children: 'content'
                })).text()).toBe('contentdeclared');
            });
        });
    });
});
