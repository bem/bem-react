import React from 'react';
import { shallow } from 'enzyme';
import { declMod } from 'bem-react-core';
import MyBlock from 'b:MyBlock m:simpleMod';
import 'b:MyBlock m:anyModVal';
import 'b:MyBlock m:customModVal';
import 'b:MyBlock m:multiMod';
import 'b:MyBlock m:theme=simple';
import 'b:MyBlock m:numberMod=0';
import 'b:MyBlock m:state=test';

it('Should apply mod declared with simple predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock simpleMod/>).type()).toBe('b');
});

it('Should apply mod declared with 0-number predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock numberMod="0"/>).type()).toBe('s');
});

it('Should apply mod declared on state', () => {
    const wrapper = shallow(<MyBlock/>);
    expect(wrapper.type()).toBe('a');
    wrapper.setState({ state : 'test' });
    expect(wrapper.type()).toBe('j');
});

it('Should apply mod declared with any mod value predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock anyModVal="white"/>).type()).toBe('i');
    expect(shallow(<MyBlock anyModVal="black"/>).type()).toBe('i');
});

it('Should apply mod declared with custom mod value predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock customModVal="button"/>).type()).toBe('button');
});

it('Should apply mod declared with multi predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock multiMod1="val1"/>).type()).toBe('a');
    expect(shallow(<MyBlock multiMod1="val1" multiMod2="val2"/>).type()).toBe('h1');
});

it('Should apply mod declared with functional predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock theme="simple"/>).type()).toBe('span');
});

it('Should throw in case without block', () => {
    expect(() => {
        declMod({ mod : 'val' }, {});
    }).toThrowError('Declaration must specify block field');
});
