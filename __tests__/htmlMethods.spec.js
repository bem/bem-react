import React from 'react';
import { shallow } from 'enzyme';
import Bem from '../';
import SimpleBlock from 'b:SimpleBlock';
import MyBlock from 'b:MyBlock';
import BlockWithStyle from 'b:BlockWithStyle';

describe('Entity without declaration', () => {
    it('Should have <div> by default', () => {
        expect(shallow(<Bem/>).type()).toBe('div');
    });

    it('Should have declared tag', () => {
        expect(shallow(<Bem tag="b"/>).type()).toBe('b');
    });

    it('Should proper attrs', () => {
        expect(shallow(<Bem tag="b" attrs={{ id : 'the-id' }}/>).prop('id'))
            .toBe('the-id');
    });
});

describe('Entity with declaration', () => {
    it('Should be a <div> by default', () => {
        expect(shallow(<SimpleBlock/>).type()).toBe('div');
    });

    it('Should have declared tag', () => {
        expect(shallow(<MyBlock/>).type()).toBe('a');
    });

    it('Should have declared attrs', () => {
        expect(shallow(<SimpleBlock id="the-id"/>).prop('id'))
            .toBe('the-id');
    });

    it('Should have declared style', () => {
        expect(shallow(<BlockWithStyle/>).props().style)
            .toMatchObject({ font : 'bold', color : 'red', background : 'blue' });
    });
});
