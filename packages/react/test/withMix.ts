import { shallow } from 'enzyme';
import { createElement } from 'react';
import { Block, Elem, withMix } from '../src';

describe('withMix:', () => {
    describe('className as bemjson', () => {
        it('Block:', () => {
            class MyBlock extends Block {}

            const Mixed = withMix(MyBlock, { block: 'Mixed' });

            expect(shallow(createElement(Mixed)).dive().find('.MyBlock.Mixed').length).toBe(1);
        });

        it('Elem:', () => {
            class MyElem extends Elem {
                protected block = 'MyBlock';
                protected elem = 'MyElem';
            }

            const Mixed = withMix(MyElem, { block: 'Mixed', elem: 'Elem' });

            expect(shallow(createElement(Mixed)).dive().find('.MyBlock-MyElem.Mixed-Elem').length).toBe(1);
        });
    });
});
