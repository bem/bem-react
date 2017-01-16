import React from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock';


it('MyBlock should understand cls prop', () => {
  const wrapper = shallow(
    <MyBlock cls='MyCustom' />
  );

  expect(wrapper.props().className).toBe('MyBlock MyBlock_a MyBlock_b_1 MyCustom');
});
