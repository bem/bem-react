import React from 'react';
import { shallow } from 'enzyme';
import ReplacedBlock from 'b:ReplacedBlock m:rewrite=replace';

it('Entity should be replaced and save wrapper', () => {
    const wrapper = shallow(<ReplacedBlock text="replacedWithThisText"/>).dive(),
        replacedBlock = wrapper.childAt(0);

    expect(wrapper.props().className).toBe('Wrapper');
    expect(replacedBlock.text()).toBe('replacedWithThisText');
});

it('Entity should rewrite replace in mod', () => {
    const wrapper = shallow(<ReplacedBlock rewrite="replace"/>).dive(),
        replacedBlock = wrapper.childAt(0).dive();

    expect(wrapper.props().className).toBe('Wrapper');
    expect(replacedBlock.props().className).toBe('ReplacedWith');
});
