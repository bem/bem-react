import { createElement } from 'react';
import { Bem, Block, Elem, Entity, withMods } from '../src';
import { getModNode, getNode } from './helpers/node';

describe('Wrap:', () => {
    it('renders declared wrapper', () => {
        class MyBlock extends Block {
            public block = 'MyBlock';
            public wrap(_p: any, _s: any, component: Entity) {
                return createElement(Bem, { block: 'Wrapper', children: component });
            }
        }
        const wrapper = getNode(createElement(MyBlock)).dive();
        expect(wrapper.prop('className')).toBe('Wrapper');
        expect(wrapper.childAt(0).prop('className')).toBe('MyBlock');
    });

    it('cancel wrap in modifier', () => {
        class MyBlock<P> extends Block<P> {
            public block = 'MyBlock';
            public wrap(_p: any, _s: any, component: Entity): Entity {
                return createElement(Bem, { block: 'Wrapper', children: component });
            }
        }

        interface IMProps {
            b?: boolean;
        }

        class BlockMod extends MyBlock<IMProps> {
            public static mod = (props: IMProps) => Boolean(props.b);
            public wrap(_p: any, _s: any, component: Entity): Entity {
                return component;
            }
        }

        const B = withMods(MyBlock, BlockMod);
        const wrapper = getModNode(createElement(B)).dive(); // has wrapper
        const wrapperWithMod = getModNode(createElement(B, { b: true })); // cancel wrap

        expect(wrapper.prop('className')).toBe('Wrapper');
        expect(wrapperWithMod.prop('className')).toBe('MyBlock');
    });
});
