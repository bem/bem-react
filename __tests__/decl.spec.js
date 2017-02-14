import React from 'react';
import { shallow } from 'enzyme';
import BlockWithMixins from 'b:BlockWithMixins';

it('Should apply mixins', () => {
    var blockWithMixins = shallow(<BlockWithMixins id="123"/>);
    expect(blockWithMixins.type()).toBe('a');
    expect(blockWithMixins.prop('id')).toBe('123');
});
