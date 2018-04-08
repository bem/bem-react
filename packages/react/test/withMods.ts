import { getModNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

const always = (variant: boolean): () => boolean => () => variant;

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Block, mod, render } = preset;

    describe('withMods:', () => {
        describe('Block:', () => {
            it('allows apply modifier as mixin', () => {
                interface IBProps {
                    a?: boolean;
                }

                class MyBlock extends Block {
                    public props: IBProps;
                    protected block = 'Block';

                    protected tag(): keyof BemCore.Tag {
                        return 'a';
                    }
                }

                interface IMProps extends IBProps {
                    b?: string;
                }

                const blockMod = mod<IMProps>(
                    (props) => props.b === 'b',
                    () => class extends MyBlock {
                    protected tag(): keyof BemCore.Tag {
                        return super.tag() + 'bbr' as 'abbr';
                    }
                });

                const B = MyBlock.withMods<IMProps>(blockMod);

                expect(getModNode(render(B, {})).type()).toBe('a');
                expect(getModNode(render(B, { b: 'b' })).type()).toBe('abbr');
            });
        });
    });
});
