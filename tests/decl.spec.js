import React from 'react';
import { shallow } from 'enzyme';
import { decl } from 'bem-react-core';
import BlockWithMixins from 'b:BlockWithMixins';

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

it('Should throw in case multiple ancestors', () => {
    expect(() => {
        const ParentBlock = decl({ block : 'ParentBlock' });
        const InheritedBlock = decl([ParentBlock], { block : 'InheritedBlock' });
        decl([InheritedBlock], { block : 'InheritedBlock' });
    }).toThrowError('BEM entity "InheritedBlock" has multiple ancestors');
});
