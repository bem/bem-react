import { getModNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

const always = (variant: boolean): () => boolean => () => variant;

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Block, mod, withMods, render } = preset;

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

                const blockModHoc = mod<IMProps>(
                    (props) => props.b === 'b',
                    class BlockMod extends MyBlock {
                        protected tag(): keyof BemCore.Tag {
                            return super.tag() + 'bbr' as 'abbr';
                        }
                    }
                );

                const B = withMods<IMProps>(MyBlock, blockModHoc);

                expect(getModNode(render(B, {})).type()).toBe('a');
                expect(getModNode(render(B, { b: 'b' })).type()).toBe('abbr');
            });

            it('allows to add modifiers for entity with modifiers', () => {
                class MyBlock extends Block {
                    protected block = 'Block';
                    protected tag(): keyof BemCore.Tag {
                        return 'a';
                    }
                }

                const blockModHoc = mod(
                    () => true,
                    class BlockMod extends MyBlock {
                        protected tag(): keyof BemCore.Tag {
                            return super.tag() + 'bbr' as 'abbr';
                        }
                    }
                );

                const blockModHoc2 = mod(
                    () => true,
                    class BlockMod2 extends MyBlock {
                        protected attrs() {
                            return { id: 'the-id' };
                        }
                    }
                );

                const B = withMods(MyBlock, blockModHoc);
                const nodeB = render(B, {});
                expect(getModNode(nodeB).type()).toBe('abbr');
                expect(getModNode(nodeB).props()).not.toHaveProperty('id');

                const C = withMods(B, blockModHoc2);
                const nodeC = render(C, {});
                expect(getModNode(nodeC).type()).toBe('abbr');
                expect(getModNode(nodeC).props()).toMatchObject({ id: 'the-id' });
            });

            it('throws error on the second withMods call', () => {
                class MyBlock extends Block {
                    protected block = 'Block';
                }

                const blockModHoc = mod(() => true, class BlockMod extends MyBlock {});

                const B = withMods(MyBlock, blockModHoc);

                expect(() => {
                    withMods(MyBlock, blockModHoc);
                }).toThrowError('You can construct component only once. Call withMods for your new instance.');
            });
        });
    });
});
