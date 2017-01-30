import React from 'react';
import { shallow } from 'enzyme';
import WrappedBlock from 'b:WrappedBlock';

it('Entity should have declared wrapper', () => {
    const wrapper = shallow(<WrappedBlock/>).dive(),
        wrappedBlock = wrapper.childAt(0);

    expect(wrapper.props().className).toBe('Wrapper');
    expect(wrappedBlock.props().className).toBe('WrappedBlock');
});
