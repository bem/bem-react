import { Tag } from '../src';
import { getModNode, getNode } from './helpers/node';
import * as BemReact from './helpers/react';
import { run } from './helpers/run';

import { Component } from 'react';

const always = (variant: boolean): () => boolean => () => variant;

type Preset = typeof BemReact /*| BemPreact*/;

run({ BemReact }, (preset: Preset) => () => {
    const { Block, withMods, render } = preset;

    describe('withMods:', () => {
        describe('Block:', () => {
            it('allows apply modifier as mixin', () => {
                interface IBProps {
                    a?: boolean;
                }

                class MyBlock extends Block<IBProps> {
                    protected block = 'Block';

                    protected tag(): Tag {
                        return this.props.a ? 'a' : 'i';
                    }
                }

                interface IMProps extends IBProps {
                    b?: string;
                }

                const blockMod = () =>
                    class BlockMod extends MyBlock {
                        public static mod = (props) => props.b === 'b';

                        protected tag(): Tag {
                            return super.tag() + 'bbr' as 'abbr';
                        }
                    };

                const B = withMods<IMProps>(MyBlock, blockMod);

                expect(getModNode(render(B, {})).type()).toBe('i');
                expect(getModNode(render(B, { a: true })).type()).toBe('a');
                expect(getModNode(render(B, { a: true, b: 'b' })).type()).toBe('abbr');
            });

            it('allows to add modifiers for entity with modifiers', () => {
                class MyBlock extends Block {
                    protected block = 'Block';
                    protected tag(): Tag {
                        return 'a';
                    }
                }

                const blockModHoc = () =>
                    class BlockMod extends MyBlock {
                        public static mod = always(true);
                        protected tag(): Tag {
                            return super.tag() + 'bbr' as 'abbr';
                        }
                    };

                const blockModHoc2 = () =>
                    class BlockMod2 extends MyBlock {
                        public static mod = always(true);
                        protected attrs() {
                            return { id: 'the-id' };
                        }
                    };

                const B = withMods(MyBlock, blockModHoc);
                const nodeB = render(B, {});
                expect(getModNode(nodeB).type()).toBe('abbr');
                expect(getModNode(nodeB).props()).not.toHaveProperty('id');

                const C = withMods(MyBlock, blockModHoc, blockModHoc2);
                const nodeC = render(C, {});
                expect(getModNode(nodeC).type()).toBe('abbr');
                expect(getModNode(nodeC).props()).toMatchObject({ id: 'the-id' });
            });

            it('allow to declare modifiers on redefinition levels', () => {
                interface IBProps {
                    a?: boolean;
                }

                class MyBlock extends Block<IBProps> {
                    protected block = 'Block';

                    protected tag(): Tag {
                        return 'a';
                    }
                }

                interface IMProps extends IBProps {
                    b?: string;
                }

                const blockModCommon = () =>
                    class BlockModCommon extends MyBlock {
                        public static mod = always(true);

                        protected tag(): Tag {
                            return super.tag() + 'bbr' as 'abbr';
                        }
                    };

                const blockModDesktop = () =>
                    class BlockModDesktop extends blockModCommon() {
                        protected tag(): Tag {
                            return 'section';
                        }
                    };

                const B = withMods<IMProps>(MyBlock, blockModDesktop);
                expect(getModNode(render(B, {})).type()).toBe('section');
            });
        });
    });
});
