import { Entity } from '../src/core';
import { getModNode, getNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Bem, Block, render, withMods } = preset;

    describe('Wrap:', () => {
        it('renders declared wrapper', () => {
            class MyBlock extends Block {
                protected block = 'MyBlock';
                protected wrap(_p: any, _s: any, component: Entity) {
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
                protected wrap(_p: any, _s: any, component: Entity): Entity {
                    return render(Bem, { block: 'Wrapper', children: component });
                }
            }

            interface IMProps {
                b?: boolean;
            }

            const blockMod = () =>
                class BlockMod extends MyBlock {
                    public static mod = (props: IMProps) => Boolean(props.b);
                    protected wrap(_p: any, _s: any, component: Entity): Entity {
                        return component;
                    }
                };

            const B = withMods(MyBlock, blockMod);
            const wrapper = getModNode(render(B)).dive(); // has wrapper
            const wrapperWithMod = getModNode(render(B, { b: true })); // cancel wrap

            expect(wrapper.prop('className')).toBe('Wrapper');
            expect(wrapperWithMod.prop('className')).toBe('MyBlock');
        });
    });
});
