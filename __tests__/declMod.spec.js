import React from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock m:theme=simple';

it('Should apply declared mod', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock theme="simple"/>).type()).toBe('span');
});
