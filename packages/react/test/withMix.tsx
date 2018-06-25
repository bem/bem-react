import { shallow } from 'enzyme';
import * as React from 'react';
import { Block, Elem, withMix } from '../src';

describe('withMix:', () => {
    describe('className as bemjson', () => {
        it('Block:', () => {
            class MyBlock extends Block {}

            const Mixed = withMix(MyBlock, { block: 'Mixed' });
            const elements = shallow(
                <Mixed />
            ).dive().find('.MyBlock.Mixed');

            expect(elements.length).toBe(1);
        });

        it('Elem:', () => {
            class MyElem extends Elem {
                public block = 'MyBlock';
                public elem = 'MyElem';
            }

            const Mixed = withMix(MyElem, { block: 'Mixed', elem: 'Elem' });
            const elements = shallow(
                <Mixed />
            ).dive().find('.MyBlock-MyElem.Mixed-Elem');

            expect(elements.length).toBe(1);
        });
    });
});
