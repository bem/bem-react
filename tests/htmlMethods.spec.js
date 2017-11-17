import React from 'react';
import { shallow } from 'enzyme';
import Bem from 'bem-react-core';
import SimpleBlock from 'b:SimpleBlock';
import MyBlock from 'b:MyBlock';
import BlockWithStyle from 'b:BlockWithStyle';

describe('Entity without declaration', () => {
    it('Should have <div> by default', () => {
        expect(shallow(<Bem block="Block"/>).type()).toBe('div');
    });

    it('Should have declared tag', () => {
        expect(shallow(<Bem block="Block" tag="b"/>).type()).toBe('b');
    });

    it('Should proper inline attrs', () => {
        expect(shallow(<Bem block="Block" tag="b" id="the-id"/>).prop('id'))
            .toBe('the-id');
    });

    it('Should merge inline attrs and attrs mode', () => {
        expect(shallow(<Bem block="Block" id="the-id" attrs={{ action : '/' }}/>).props())
            .toMatchObject({
                id : 'the-id',
                action : '/'
            });
    });

    it('Should have props priority', () => {
        expect(shallow(<Bem block="Block" id="the-id" attrs={{ id : 'no-id' }}/>).prop('id'))
            .toBe('the-id');
    });

    it('Should render aria', () => {
        expect(shallow(<Bem block="Block" tag="b" attrs={{ 'aria-labelledby' : 'address' }}/>).prop('aria-labelledby'))
            .toBe('address');
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
        expect(shallow(<SimpleBlock ariaLabelledBy="address" id="the-id"/>).props())
            .toMatchObject({
                'aria-labelledby' : 'address',
                id : 'the-id'
            });
    });

    it('Should have declared style', () => {
        expect(shallow(<BlockWithStyle/>).props().style)
            .toMatchObject({ font : 'bold', color : 'red', background : 'blue' });
    });
});
