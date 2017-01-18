import React from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock';

it('MyBlock should be a', () => {
    const wrapper = shallow(
        <MyBlock />
    );

    expect(wrapper.type()).toBe('a');
});

it('MyBlock should have default mods', () => {
    const wrapper = shallow(
        <MyBlock />
    );

    expect(wrapper.props().className).toBe('MyBlock MyBlock_a MyBlock_b_1');
});

it('MyBlock should have disabled mod', () => {
    const wrapper = shallow(
        <MyBlock disabled />
    );

    expect(wrapper.props().className).toBe('MyBlock MyBlock_disabled MyBlock_a MyBlock_b_1');
});
