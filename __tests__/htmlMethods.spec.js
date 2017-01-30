import React from 'react';
import { shallow } from 'enzyme';
import Bem from '../';
import SimpleBlock from 'b:SimpleBlock';
import MyBlock from 'b:MyBlock';

describe('Entity without declaration', () => {
    it('Entity should have <div> by default', () => {
        expect(shallow(<Bem/>).type()).toBe('div');
    });

    it('Entity should have declared tag', () => {
        expect(shallow(<Bem tag="b"/>).type()).toBe('b');
    });

    it('Entity should proper attrs', () => {
        expect(shallow(<Bem tag="b" attrs={{ id : 'the-id' }}/>).prop('id'))
            .toBe('the-id');
    });
});

describe('Entity with declaration', () => {
    it('Entity should be a <div> by default', () => {
        expect(shallow(<SimpleBlock/>).type()).toBe('div');
    });

    it('Entity should have declared tag', () => {
        expect(shallow(<MyBlock/>).type()).toBe('a');
    });

    it('Entity should have declared attrs', () => {
        expect(shallow(<SimpleBlock id="the-id"/>).prop('id'))
            .toBe('the-id');
    });
});
