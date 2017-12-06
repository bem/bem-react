import React from 'react';
import { shallow } from 'enzyme';
import WrappedBlock from 'b:WrappedBlock m:another=way m:cancel=wrap';

it('Entity should have declared wrapper', () => {
    const wrapper = shallow(<WrappedBlock/>).dive(),
        wrappedBlock = wrapper.childAt(0);

    expect(wrapper.props().className).toBe('Wrapper');
    expect(wrappedBlock.props().className).toBe('WrappedBlock');
});

it('Entity should inherit wrapper', () => {
    const wrapper = shallow(<WrappedBlock another="way"/>).dive(),
        wrappedWrapper = wrapper.childAt(0).dive(),
        wrappedBlock = wrappedWrapper.childAt(0);

    expect(wrapper.props().className).toBe('WrapperInMod');
    expect(wrappedWrapper.props().className).toBe('Wrapper');
    expect(wrappedBlock.props().className).toBe('WrappedBlock WrappedBlock_another_way');
});

it('Entity should cancel wrap in mod', () => {
    expect(shallow(<WrappedBlock cancel="wrap"/>).props().className)
        .toBe('WrappedBlock WrappedBlock_cancel_wrap');
});
