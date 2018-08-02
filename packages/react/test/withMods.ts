import { createElement } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getModNode, getMountedNode } from './helpers/node';
import { IBRCStatelessComponent } from '../src/interfaces';

const always = (variant: boolean): () => boolean => () => variant;

describe('withMods:', () => {
    describe('Block:', () => {
        it('allows apply modifier as mixin', () => {
            interface IBProps {
                a?: boolean;
            }

            class MyBlock<P> extends Block<P & IBProps> {
                public block = 'Block';

                public tag(): string {
                    return this.props.a ? 'a' : 'i';
                }
            }

            interface IMProps {
                b?: string;
            }
            class BlockMod extends MyBlock<IMProps> {
                public static mod = (props: IMProps) => props.b === 'b';

                public tag() {
                    return super.tag() + 'bbr';
                }
            }

            const B = withMods(MyBlock, BlockMod);

            expect(getMountedNode(createElement(B, {})).childAt(0).type()).toBe('i');
            expect(getMountedNode(createElement(B, { a: true })).childAt(0).type()).toBe('a');
            expect(getMountedNode(createElement(B, { a: true, b: 'b' })).childAt(0).type()).toBe('abbr');
        });

        it('allows to add modifiers for entity with modifiers', () => {
            class MyBlock extends Block {
                public block = 'Block';
                public tag() {
                    return 'a';
                }
            }
            class BlockMod extends MyBlock {
                public static mod = always(true);
                public tag() {
                    return super.tag() + 'bbr';
                }
            }
            class BlockMod2 extends MyBlock {
                public static mod = always(true);
                public attrs() {
                    return { id: 'the-id' };
                }
            }

            const B = withMods(MyBlock, BlockMod);
            const nodeB = createElement(B, {});
            expect(getMountedNode(nodeB).childAt(0).type()).toBe('abbr');
            expect(getMountedNode(nodeB).childAt(0).props()).not.toHaveProperty('id');

            const C = withMods(MyBlock, BlockMod, BlockMod2);
            const nodeC = createElement(C, {});
            expect(getMountedNode(nodeC).childAt(0).type()).toBe('abbr');
            expect(getMountedNode(nodeC).childAt(0).props()).toMatchObject({ id: 'the-id' });
        });

        it('allow to declare modifiers on redefinition levels', () => {
            interface IBProps {
                a?: boolean;
            }

            class MyBlock<P> extends Block<P & IBProps> {
                public block = 'Block';

                public tag() {
                    return 'a';
                }
            }

            interface IMProps {
                b?: string;
            }
            class BlockModCommon extends MyBlock<IMProps> {
                public static mod = always(true);

                public tag() {
                    return super.tag() + 'bbr';
                }
            }

            class BlockModDesktop extends BlockModCommon {
                public tag() {
                    return 'section';
                }
            }

            const B = withMods(MyBlock, BlockModDesktop);
            expect(getMountedNode(createElement(B, {})).childAt(0).type()).toBe('section');
        });

        it('complex methods in modifiers', () => {
            interface IBlockProps {
                c: string;
            }

            class MyBlock<P extends IBlockProps> extends Block<P> {
                public static defaultProps = {
                    c: 'c'
                };

                public block = 'MyBlock';

                public tag() {
                    return 'a';
                }
            }

            interface IMod1Props extends IBlockProps {
                a: string;
            }

            class BlockMod1 extends MyBlock<IMod1Props> {
                public static mod = always(true);

                public static defaultProps = {
                    ...MyBlock.defaultProps,
                    a: 'a'
                };

                public tag() {
                    return super.tag() + 'bbr' + this.props.a;
                }
            }

            interface IMod2Props extends IBlockProps {
                b: string;
            }
            class BlockMod2 extends MyBlock<IMod2Props> {
                public static mod = always(true);

                public static defaultProps = {
                    ...MyBlock.defaultProps,
                    b: 'b'
                };

                public tag() {
                    return super.tag() + 'section' + this.props.b;
                }
            }

            const A = withMods(MyBlock, BlockMod1);
            const B = withMods(MyBlock, BlockMod2);
            const C = withMods(MyBlock, BlockMod1, BlockMod2);

            expect(getMountedNode(createElement(A)).childAt(0).type()).toBe('abbra');
            expect(getMountedNode(createElement(B)).childAt(0).type()).toBe('asectionb');
            expect(getMountedNode(createElement(C)).childAt(0).type()).toBe('abbrasectionb');
        });

        it('allows to use modifiers for extended entity', () => {
            class MyBlock extends Block {
                public block = 'Block';
                public tag() {
                    return 'a';
                }
            }

            class MyBlock2 extends MyBlock {
                public tag() {
                    return 'b';
                }
            }
            class BlockMod extends MyBlock {
                public static mod = always(true);
                public tag() {
                    return super.tag() + 'bbr';
                }
            }

            const B = withMods(MyBlock2, BlockMod);
            const nodeB = createElement(B, {});
            expect(getMountedNode(nodeB).childAt(0).type()).toBe('bbbr');
        });

        it('allows to get info about base type', () => {
            class MyBlock extends Block {
                public block = 'Block';
            }

            class BlockMod extends MyBlock {
                public static mod = always(true);
            }

            const B = withMods(MyBlock, BlockMod);
            const nodeB = createElement(B, {});
            expect((nodeB.type as IBRCStatelessComponent).__base).toBe(MyBlock);
        });
    });
});
