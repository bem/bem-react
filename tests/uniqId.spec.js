import React from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock';

it('Should generate id', () => {
    expect(shallow(<MyBlock/>).prop('id'))
        .toMatch(/uniq\$/);
});
