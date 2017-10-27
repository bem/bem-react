import React from 'react';
import { shallow, render } from 'enzyme';
import { decl } from 'bem-react-core';
import BlockWithMixins from 'b:BlockWithMixins';
import MultiInheritC from 'b:MultiInheritC';

it('Should apply mixins', () => {
    var blockWithMixins = shallow(<BlockWithMixins id="123"/>);
    expect(blockWithMixins.type()).toBe('a');
    expect(blockWithMixins.prop('id')).toBe('123');
});

it('Should throw in case without block', () => {
    expect(() => {
        decl({});
    }).toThrowError('Declaration must specify block field');
});

it('Should properly inherit in case multiple ancestors', () => {
    expect(render(<MultiInheritC/>).text())
        .toEqual('0123');
});
