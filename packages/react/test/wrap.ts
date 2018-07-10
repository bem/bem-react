import { createElement, ReactNode } from 'react';
import { Bem, Block, Elem, withMods } from '../src';
import { getMountedNode } from './helpers/node';

describe('Wrap:', () => {
    it('renders declared wrapper', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
            public wrap(_p: any, _s: any, component: ReactNode) {
                return createElement(Bem, { block: 'Wrapper', children: component });
            }
        }
        const wrapper = getMountedNode(createElement(MyBlock));
        expect(wrapper.childAt(0).prop('className')).toBe('Wrapper');
        expect(wrapper.childAt(0).childAt(0).prop('className')).toBe('MyBlock');
    });

    it('cancel wrap in modifier', () => {
        class MyBlock<P> extends Block<P> {
            public block = 'MyBlock';
            public wrap(_p: any, _s: any, component: ReactNode): ReactNode {
                return createElement(Bem, { block: 'Wrapper', children: component });
            }
        }

        interface IMProps {
            b?: boolean;
        }

        class BlockMod extends MyBlock<IMProps> {
            public static mod = (props: IMProps) => Boolean(props.b);
            public wrap(_p: any, _s: any, component: ReactNode): ReactNode {
                return component;
            }
        }

        const B = withMods(MyBlock, BlockMod);
        const wrapper = getMountedNode(createElement(B)); // has wrapper
        const wrapperWithMod = getMountedNode(createElement(B, { b: true })); // cancel wrap

        expect(wrapper.childAt(0).childAt(0).prop('className')).toBe('Wrapper');
        expect(wrapperWithMod.childAt(0).prop('className')).toBe('MyBlock');
    });
});
