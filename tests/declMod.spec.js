import { h } from 'preact';
import { deep } from 'preact-render-spy';
import { declMod } from 'bem-react-core';
import MyBlock from 'b:MyBlock m:simpleMod';
import 'b:MyBlock m:anyModVal';
import 'b:MyBlock m:customModVal';
import 'b:MyBlock m:multiMod';
import 'b:MyBlock m:theme=simple';
import 'b:MyBlock m:numberMod=0';

const getTag = node => deep(node).output().nodeName;

it('Should apply mod declared with simple predicate', () => {
    expect(getTag(<MyBlock/>)).toBe('a');
    expect(getTag(<MyBlock simpleMod/>)).toBe('b');
});

it('Should apply mod declared with 0-number predicate', () => {
    expect(getTag(<MyBlock/>)).toBe('a');
    expect(getTag(<MyBlock numberMod="0"/>)).toBe('s');
});

it('Should apply mod declared with any mod value predicate', () => {
    expect(getTag(<MyBlock/>)).toBe('a');
    expect(getTag(<MyBlock anyModVal="white"/>)).toBe('i');
    expect(getTag(<MyBlock anyModVal="black"/>)).toBe('i');
});

it('Should apply mod declared with custom mod value predicate', () => {
    expect(getTag(<MyBlock/>)).toBe('a');
    expect(getTag(<MyBlock customModVal="button"/>)).toBe('button');
});

it('Should apply mod declared with multi predicate', () => {
    expect(getTag(<MyBlock/>)).toBe('a');
    expect(getTag(<MyBlock multiMod1="val1"/>)).toBe('a');
    expect(getTag(<MyBlock multiMod1="val1" multiMod2="val2"/>)).toBe('h1');
});

it('Should apply mod declared with functional predicate', () => {
    expect(getTag(<MyBlock/>)).toBe('a');
    expect(getTag(<MyBlock theme="simple"/>)).toBe('span');
});

it('Should throw in case without block', () => {
    expect(() => {
        declMod({ mod : 'val' }, {});
    }).toThrowError('Declaration must specify block field');
});
