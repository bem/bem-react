import { h } from 'preact';
import { deep } from 'preact-render-spy';
import Bem from 'bem-react-core';
import SimpleBlock from 'b:SimpleBlock';
import MyBlock from 'b:MyBlock';
import BlockWithStyle from 'b:BlockWithStyle';

const getTag = node => deep(node).output().nodeName;
const getAttr = (node, attr) => deep(node).output().attributes[attr];

describe('Entity without declaration', () => {
    it('Should have <div> by default', () => {
        expect(getTag(<Bem block="Block"/>)).toBe('div');
    });

    it('Should have declared tag', () => {
        expect(getTag(<Bem block="Block" tag="b"/>)).toBe('b');
    });

    it('Should proper attrs', () => {
        expect(getAttr(<Bem block="Block" tag="b" attrs={{ id : 'the-id' }}/>, 'id')).toBe('the-id');
    });
});

describe('Entity with declaration', () => {
    it('Should be a <div> by default', () => {
        expect(getTag(<SimpleBlock/>)).toBe('div');
    });

    it('Should have declared tag', () => {
        expect(getTag(<MyBlock/>)).toBe('a');
    });

    it('Should have declared attrs', () => {
        expect(getAttr(<SimpleBlock id="the-id"/>, 'id')).toBe('the-id');
    });

    it('Should have declared style', () => {
        expect(getAttr(<BlockWithStyle/>, 'style'))
            .toMatchObject({ font : 'bold', color : 'red', background : 'blue' });
    });
});
