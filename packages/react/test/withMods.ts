import { createElement } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getModNode } from './helpers/node';

const always = (variant: boolean): () => boolean => () => variant;

describe('withMods:', () => {
    describe('Block:', () => {
        it('allows apply modifier as mixin', () => {
            interface IBProps {
                a?: boolean;
            }

            class MyBlock<P> extends Block<P & IBProps> {
                protected block = 'Block';

                protected tag(): string {
                    return this.props.a ? 'a' : 'i';
                }
            }

            interface IMProps {
                b?: string;
            }

            const blockMod = () =>
                class BlockMod extends MyBlock<IMProps> {
                    public static mod = (props: IMProps) => props.b === 'b';

                    protected tag() {
                        return super.tag() + 'bbr';
                    }
                };

            const B = withMods(MyBlock, blockMod);

            expect(getModNode(createElement(B, {})).type()).toBe('i');
            expect(getModNode(createElement(B, { a: true })).type()).toBe('a');
            expect(getModNode(createElement(B, { a: true, b: 'b' })).type()).toBe('abbr');
        });

        it('allows to add modifiers for entity with modifiers', () => {
            class MyBlock extends Block {
                protected block = 'Block';
                protected tag() {
                    return 'a';
                }
            }

            const blockModHoc = () =>
                class BlockMod extends MyBlock {
                    public static mod = always(true);
                    protected tag() {
                        return super.tag() + 'bbr';
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
            const nodeB = createElement(B, {});
            expect(getModNode(nodeB).type()).toBe('abbr');
            expect(getModNode(nodeB).props()).not.toHaveProperty('id');

            const C = withMods(MyBlock, blockModHoc, blockModHoc2);
            const nodeC = createElement(C, {});
            expect(getModNode(nodeC).type()).toBe('abbr');
            expect(getModNode(nodeC).props()).toMatchObject({ id: 'the-id' });
        });

        it('allow to declare modifiers on redefinition levels', () => {
            interface IBProps {
                a?: boolean;
            }

            class MyBlock<P> extends Block<P & IBProps> {
                protected block = 'Block';

                protected tag() {
                    return 'a';
                }
            }

            interface IMProps {
                b?: string;
            }

            const blockModCommon = () =>
                class BlockModCommon extends MyBlock<IMProps> {
                    public static mod = always(true);

                    protected tag() {
                        return super.tag() + 'bbr';
                    }
                };

            const blockModDesktop = () =>
                class BlockModDesktop extends blockModCommon() {
                    protected tag() {
                        return 'section';
                    }
                };

            const B = withMods(MyBlock, blockModDesktop);
            expect(getModNode(createElement(B, {})).type()).toBe('section');
        });

        it('allows apply modifier with object mod', () => {
            interface IBProps {
                a?: boolean;
                b?: string;
                c?: boolean;
            }

            class MyBlock<P = {}> extends Block<P & IBProps> {
                protected block = 'Block';

                protected tag() {
                    return 'a';
                }
            }

            const blockModCommon = () =>
                class BlockModCommon extends MyBlock {
                    public static mod(props) {
                        return props.a === true && props.b === 'b';
                    }

                    protected tag() {
                        return super.tag() + 'bbr';
                    }
                };

            const blockModDesktop = () =>
                class BlockModDesktop extends blockModCommon() {
                    protected tag() {
                        return 'section';
                    }
                };

            const B = withMods(MyBlock, blockModDesktop);

            expect(getModNode(createElement(B, { a: true, b: 'b', c: true })).type()).toBe('section');
            expect(getModNode(createElement(B, { a: true, b: 'c' })).type()).toBe('a');
        });
    });
});
