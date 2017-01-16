import React from 'react';
import { shallow } from 'enzyme';
import Bem from '../';
import BlockWithoutClass from 'b:BlockWithoutClass';

it('BlockWithoutClass should be without class', () => {
  const wrapper = shallow(
    <BlockWithoutClass />
  );

  expect(wrapper.props().className).toBe(undefined);
});

it('SimpleComponent should be without class', () => {
  const wrapper = shallow(
    <Bem block='block' addBemClassName={false} />
  );

  expect(wrapper.props().className).toBe(undefined);
});
