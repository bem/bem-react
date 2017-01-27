import React from 'react';
import { shallow } from 'enzyme';
import Bem from '../';
import BlockWithoutClass from 'b:BlockWithoutClass';
import MyBlock from 'b:MyBlock';
import MyBlockElem from 'b:MyBlock e:Elem';

describe('Entity without declaration', () => {
    it('Block without declaration should have proper CSS class', () => {
        expect(getClassName(<Bem block="Block"/>)).toBe('Block');
    });

    it('Block without declaration with mods should have proper CSS class', () => {
        const classNames = getClassNames(
            <Bem block="Block" mods={{ a : true, b : 1 }}/>
        );

        expect(classNames).toContain('Block_a');
        expect(classNames).toContain('Block_b_1');
    });

    it('Elem without declaration should have proper CSS class', () => {
        expect(getClassName(<Bem block="Block" elem="Elem"/>))
            .toBe('Block-Elem');
    });

    it('Elem without declaration with mods should have proper CSS class', () => {
        const classNames = getClassNames(
            <Bem block="Block" elem="Elem" mods={{ a : true, b : 1 }}/>
        );

        expect(classNames).toContain('Block-Elem_a');
        expect(classNames).toContain('Block-Elem_b_1');
    });

    it('Block without declaration should allow omiting CSS class', () => {
        expect(getClassName(<Bem block="Block" addBemClassName={false}/>))
            .toBe(undefined);
    });

    it('Elem without declaration should allow omiting CSS class', () => {
        expect(getClassName(<Bem block="Block" elem="Elem" addBemClassName={false}/>))
            .toBe(undefined);
    });

    it('Block should allow adding other CSS class', () => {
        expect(getClassNames(<Bem block="Block" cls="MyCustom"/>))
            .toContain('MyCustom');
    });

    it('Elem should allow adding other CSS class', () => {
        expect(getClassNames(<Bem block="Block" elem="Elem" cls="MyCustom"/>))
            .toContain('MyCustom');
    });
});

describe('Entity with declaration', () => {
    it('Block should have block CSS class', () => {
        expect(getClassNames(<MyBlock/>)).toContain('MyBlock');
    });

    it('Block should have elem CSS class', () => {
        expect(getClassNames(<MyBlockElem/>)).toContain('MyBlock-Elem');
    });

    it('Block should have CSS classes in accordance with mods', () => {
        const classNames = getClassNames(<MyBlock disabled/>);

        expect(classNames).toContain('MyBlock_disabled');
        expect(classNames).toContain('MyBlock_a');
        expect(classNames).toContain('MyBlock_b_1');
    });

    it('Block should allow omiting CSS class', () => {
        expect(getClassName(<BlockWithoutClass/>)).toBe(undefined);
    });

    it('Block should allow adding other CSS class', () => {
        expect(getClassNames(<MyBlock cls="MyCustom"/>)).toContain('MyCustom');
    });

    it('Elem should allow adding other CSS class', () => {
        expect(getClassNames(<MyBlockElem cls="MyCustom"/>))
            .toContain('MyCustom');
    });
});

function getClassNames(node) {
    return getClassName(node).split(' ');
}

function getClassName(node) {
    return shallow(node).props().className;
}
