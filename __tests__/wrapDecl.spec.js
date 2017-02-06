import React from 'react';
import { shallow } from 'enzyme';
import BlockWithWrapDecl from 'b:BlockWithWrapDecl';

it('Entity should have hook', () => {
    const wrapper = shallow(<BlockWithWrapDecl id="1"/>);

    expect(wrapper.props()).toMatchObject({
        tabIndex : '-1',
        id : '1'
    });
});
