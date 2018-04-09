import { getMountedNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Bem, Block, Elem, render } = preset;

    describe('DisplayName:', () => {

        describe('Bem:', () => {
            it('generates name in runtime', () => {
                expect(getMountedNode(render(Bem, { block: 'Block' })).name()).toBe('Bem');
            });
        });

        describe('Block:', () => {
            it('generates name in runtime', () => {
                class MyBlock extends Block {
                    protected block = 'MyBlock';
                }
                expect(getMountedNode(render(MyBlock)).name()).toBe('MyBlock');
            });
        });

        describe('Elem:', () => {
            it('generates name in runtime', () => {
                class MyElem extends Elem {
                    protected block = 'MyBlock';
                    protected elem = 'Shalala';
                }
                expect(getMountedNode(render(MyElem)).name()).toBe('MyBlock-Shalala');
            });
        });
    });
});
