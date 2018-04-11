import { getModNode, getNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Bem, Block, mod, render, withMods } = preset;

    describe('Wrap:', () => {
        it('renders declared wrapper', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected wrap(component) {
                    return render(Bem, { block: 'Wrapper', children: component });
                }
            }
            const wrapper = getNode(render(MyBlock)).dive();
            expect(wrapper.prop('className')).toBe('Wrapper');
            expect(wrapper.childAt(0).prop('className')).toBe('MyBlock');
        });

        it('cancel wrap in modifier', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected wrap(component) {
                    return render(Bem, { block: 'Wrapper', children: component });
                }
            }

            interface IMProps {
                b?: boolean;
            }

            const blockMod = mod(
                (props: IMProps) => props.b,
                class BlockMod extends MyBlock {
                    protected wrap(component) {
                        return component;
                    }
                }
            );

            const B = withMods(MyBlock, blockMod);
            const wrapper = getModNode(render(B)).dive(); // has wrapper
            const wrapperWithMod = getModNode(render(B, { b: true })); // cancel wrap

            expect(wrapper.prop('className')).toBe('Wrapper');
            expect(wrapperWithMod.prop('className')).toBe('MyBlock');
        });
    });
});
