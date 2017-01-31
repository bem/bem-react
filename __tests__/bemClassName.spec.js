import React from 'react';
import { shallow } from 'enzyme';
import Bem from '../';
import BlockWithoutClass from 'b:BlockWithoutClass';
import MyBlock from 'b:MyBlock m:simpleMod m:anyModVal m:customModVal m:multiMod';
import 'b:MyBlock m:theme=simple m:mergedMods m:cancelledMod';
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

    it('Block should allow adding mix', () => {
        expect(getClassNames(<Bem block="Block" mix={[{ block : 'Block2' }]}/>))
            .toContain('Block2');
    });

    it('Elem should allow adding mix', () => {
        expect(getClassNames(
            <Bem block="Block" elem="Elem" mix={[{ block : 'Block2', elem : 'Elem2' }]}/>
        )).toContain('Block2-Elem2');
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

    it('Block should have CSS classes in accordance with simple predicate', () => {
        const classNames = getClassNames(<MyBlock simpleMod/>);

        expect(classNames).toContain('MyBlock_a');
        expect(classNames).toContain('MyBlock_simpleMod');
    });

    it('Block should have CSS classes in accordance with any mod val predicate', () => {
        const classNames = getClassNames(<MyBlock anyModVal="red"/>);

        expect(classNames).toContain('MyBlock_a');
        expect(classNames).toContain('MyBlock_anyModVal_red');
    });

    it('Block should have CSS classes in accordance with custom mod val predicate', () => {
        const classNames = getClassNames(<MyBlock customModVal="button"/>);

        expect(classNames).toContain('MyBlock_a');
        expect(classNames).toContain('MyBlock_customModVal_button');
    });

    it('Block should have CSS classes in accordance with multi mod val predicate', () => {
        const classNames = getClassNames(<MyBlock multiMod1="val1" multiMod2="val2"/>);

        expect(classNames).toContain('MyBlock_a');
        expect(classNames).toContain('MyBlock_multiMod1_val1');
        expect(classNames).toContain('MyBlock_multiMod2_val2');
    });

    it('Block should have CSS classes in accordance with merge of predicate and declared mode', () => {
        const classNames = getClassNames(<MyBlock firstMod="first"/>);

        expect(classNames).toContain('MyBlock_a');
        expect(classNames).toContain('MyBlock_firstMod_first');
        expect(classNames).toContain('MyBlock_secondMod_second');
    });

    it('Block should cancel CSS classes in accordance with merge of predicate and declared mode', () => {
        expect(getClassNames(<MyBlock cancelledMod="yes"/>))
            .not.toContain('MyBlock_cancelledMod_yes');
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

    it('Block should allow adding mix', () => {
        expect(getClassNames(<MyBlock mix={[{ block : 'Block2' }]}/>))
            .toContain('Block2');
    });

    it('Elem should allow adding mix', () => {
        expect(getClassNames(
            <MyBlockElem mix={[{ block : 'Block2', elem : 'Elem2' }]}/>
        )).toContain('Block2-Elem2');
    });
});

function getClassNames(node) {
    return getClassName(node).split(' ');
}

function getClassName(node) {
    return shallow(node).props().className;
}
