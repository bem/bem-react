import React from 'react';
import { shallow } from 'enzyme';
import MyBlock from 'b:MyBlock m:simpleMod m:anyModVal m:customModVal m:multiMod m:theme=simple';

it('Should apply mod declared with simple predicate', () => {
    expect(shallow(<MyBlock/>).type()).toBe('a');
    expect(shallow(<MyBlock simpleMod/>).type()).toBe('b');
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
