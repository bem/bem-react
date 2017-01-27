import React from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock';

it('MyBlock should be a', () => {
    const wrapper = shallow(
        <MyBlock/>
    );

    expect(wrapper.type()).toBe('a');
});
