import React from 'react';
import { shallow, mount } from 'enzyme';
import Bem from 'bem-react-core';
import BlockWithoutClass from 'b:BlockWithoutClass';
import BlockWithDeclaredMix from 'b:BlockWithDeclaredMix';
import BlockWithDeclaredAddMix from 'b:BlockWithDeclaredAddMix';
import MyBlock from 'b:MyBlock m:simpleMod m:anyModVal m:customModVal m:multiMod';
import 'b:MyBlock m:theme=simple m:mergedMods m:cancelledMod';
import MyBlockElem from 'b:MyBlock e:Elem';
import MyBlockElemWithContent from 'b:MyBlock e:ElemWithContent';
import InheritedBlock from 'b:InheritedBlock';
import InheritedElem from 'b:InheritedBlock e:IElem';
import InheritedElemFromBlock from 'b:InheritedBlock e:ElemFromBlock';
import AnotherNamingBlockElem from 'b:another-naming-block e:elem';

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
        expect(getClassNames(<Bem block="Block" mix={{ block : 'Block2' }}/>))
            .toContain('Block2');

        expect(getClassNames(<Bem block="Block" mix={[{ block : 'Block2' }]}/>))
            .toContain('Block2');

        expect(getClassNames(<Bem block="Block" mix={[{ block : 'Block2', mods : { mod1 : 'val1' } }]}/>))
            .toContain('Block2', 'Block2_mod1_val1');
    });

    it('Elem should allow adding mix', () => {
        expect(getClassNames(
            <Bem block="Block" elem="Elem" mix={{ block : 'Block2', elem : 'Elem2' }}/>
        )).toContain('Block2-Elem2');

        expect(getClassNames(
            <Bem block="Block" elem="Elem" mix={[{ block : 'Block2', elem : 'Elem2' }]}/>
        )).toContain('Block2-Elem2');

        expect(getClassNames(
            <Bem block="Block" elem="Elem" mix={[{ block : 'Block2', elem : 'Elem2', mods : { mod1 : 'val1' } }]}/>
        )).toContain('Block2-Elem2', 'Block2-Elem2_mod1_val1');
    });

    describe('Infer block from context', () => {
        it('Elem should infer block from context whithout declaration', () => {
            expect(mount(
                <Bem block="Block">
                    <Bem elem="Elem"/>
                </Bem>
            ).find('.Block-Elem')).toHaveLength(1);
        });

        it('Elem should not infer block from elem context without declaration', () => {
            expect(mount(
                <Bem block="Block">
                    <Bem block="Block2" elem="Elem2">
                        <Bem elem="Elem"/>
                    </Bem>
                </Bem>
            ).find('.Block-Elem')).toHaveLength(1);
        });

        it('Elem should infer block from context with declaration', () => {
            expect(mount(
                <BlockWithoutClass>
                    <Bem elem="Elem"/>
                </BlockWithoutClass>
            ).find('.BlockWithoutClass-Elem')).toHaveLength(1);
        });

        it('Elem should infer block from context with declaration in case of nested elems', () => {
            expect(mount(
                <BlockWithoutClass>
                    <Bem elem="Elem1">
                        <Bem elem="Elem2"/>
                    </Bem>
                </BlockWithoutClass>
            ).find('.BlockWithoutClass-Elem2')).toHaveLength(1);
        });

        it('Elem should infer block from context with declaration in case of nested elems without block', () => {
            expect(mount(
                <Bem block="Block" elem="Elem1">
                    <Bem elem="Elem2"/>
                </Bem>
            ).find('.Block-Elem2')).toHaveLength(1);
        });

        it('Elem should throw exception in case of undefined context block', () => {
            expect(() => {
                mount(
                    <Bem elem="Elem1">
                        <Bem elem="Elem2"/>
                    </Bem>
                );
            }).toThrowError('Can\'t get block from context');
        });

        it('Elem should throw exception in case of undefined elem', () => {
            expect(() => {
                mount(
                    <Bem block="Block">
                        <Bem/>
                    </Bem>
                );
            }).toThrowError('Prop elem must be specified');
        });

        it('Elem should not infer block from elem context with declaration', () => {
            expect(mount(
                <BlockWithoutClass>
                    <MyBlockElem>
                        <Bem elem="Elem"/>
                    </MyBlockElem>
                </BlockWithoutClass>
            ).find('.BlockWithoutClass-Elem')).toHaveLength(1);
        });

        it('Elem should not infer block from elem context with declaration in case of nested elems', () => {
            expect(mount(
                <MyBlock>
                    <MyBlockElemWithContent/>
                </MyBlock>
            ).find('.MyBlock-InnerElem')).toHaveLength(1);
        });

        it('Elem should infer block from elem context with declaration in case of nested elems without block', () => {
            expect(mount(
                <MyBlockElemWithContent/>
            ).find('.MyBlock-InnerElem')).toHaveLength(1);
        });
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
        expect(getClassNames(<MyBlock mix={{ block : 'Block2' }}/>))
            .toContain('Block2');

        expect(getClassNames(<MyBlock mix={[{ block : 'Block2' }]}/>))
            .toContain('Block2');

        expect(getClassNames(<MyBlock mix={[{ block : 'Block2', mods : { mod1 : 'val1' } }]}/>))
            .toContain('Block2', 'Block2_mod1_val1');
    });

    it('Elem should allow adding mix', () => {
        expect(getClassNames(
            <MyBlockElem mix={{ block : 'Block2', elem : 'Elem2' }}/>
        )).toContain('Block2-Elem2');

        expect(getClassNames(
            <MyBlockElem mix={[{ block : 'Block2', elem : 'Elem2' }]}/>
        )).toContain('Block2-Elem2');

        expect(getClassNames(
            <MyBlockElem mix={[{ block : 'Block2', elem : 'Elem2', mods : { mod1 : 'val1' } }]}/>
        )).toContain('Block2-Elem2', 'Block2-Elem2_mod1_val1');
    });

    it('Mix class should appear only once', () => {
        expect(getClassName(<MyBlock mix={[{ block : 'Block2' }]}/>))
            .toBe('MyBlock MyBlock_a MyBlock_b_1 Block2');
    });

    it('Mix from decl should override mix from props', () => {
        expect(getClassName(<BlockWithDeclaredMix mix={[{ block : 'Block2', elem : 'Elem2' }]}/>))
            .toBe('BlockWithDeclaredMix Mixed');
    });

    it('Adding mix from decl should be concated with mix from props', () => {
        expect(getClassName(<BlockWithDeclaredAddMix mix={[{ block : 'Mixed', mods : { m2 : 'v2' } }]}/>))
            .toBe('BlockWithDeclaredAddMix Mixed Mixed_m2_v2 Mixed_m1_v1');
    });

    it('Inherited block should have proper CSS class', () => {
        const className = getClassName(<InheritedBlock/>);
        expect(className).toBe('InheritedBlock InheritedBlock_a InheritedBlock_b_1');
    });

    it('Inherited Elem should have proper CSS class', () => {
        const className = getClassName(<InheritedElem/>);
        expect(className).toBe('InheritedBlock-IElem InheritedBlock-IElem_a InheritedBlock-IElem_b_1');
    });

    it('Inherited Elem from Block should have proper CSS class', () => {
        const className = getClassName(<InheritedElemFromBlock/>);
        expect(className).toBe('InheritedBlock-ElemFromBlock Mixed');
    });

    it('Should inherit naming', () => {
        expect(getClassName(<AnotherNamingBlockElem/>))
            .toBe('another-naming-block__elem another-naming-block__elem--try');
    });
});

function getClassNames(node) {
    return getClassName(node).split(' ');
}

function getClassName(node) {
    return shallow(node).props().className;
}
