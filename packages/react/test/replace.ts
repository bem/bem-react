import { getModNode, getNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Block, mod, render, withMods } = preset;

    describe('Replace:', () => {
        it('allows to replace self', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected replace() {
                    return 'Replaced with text';
                }
            }
            expect(getNode(render(MyBlock)).html()).toBe('');
            expect(getNode(render(MyBlock)).text()).toBe('Replaced with text');
        });

        it('allows rewrite replace in modifier', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected replace(): BemCore.Node {
                    return 'Replaced with text';
                }
            }

            const blockMod = mod(
                () => true,
                class BlockMod extends MyBlock {
                    protected replace() {
                        return render('span', {
                            children: super.replace() + ' with mod content'
                        });
                    }
                }
            );

            const B = withMods(MyBlock, blockMod);

            expect(getModNode(render(B)).name()).toBe('span');
            expect(getModNode(render(B)).text()).toBe('Replaced with text with mod content');
        });

        it('allows rewrite replace in modifier', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected content() {
                    return 'default content';
                }
            }

            interface IMProps {
                b?: boolean;
            }

            const blockMod = mod(
                (props: IMProps) => props.b,
                class BlockMod extends MyBlock {
                    protected replace() {
                        return render('span', {
                            children: 'replaced content'
                        });
                    }
                }
            );

            const B = withMods(MyBlock, blockMod);

            expect(getModNode(render(B)).text()).toBe('default content');
            expect(getModNode(render(B, { b: true })).text()).toBe('replaced content');
        });
    });
});
