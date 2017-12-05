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
import MixedInstance from 'b:MixedInstance';
import SimpleInheritedBlock from 'b:SimpleInheritedBlock';
import AnotherNamingBlockElem from 'b:another-naming-block e:elem';

const arrayPart = expect.arrayContaining;
class Boundary extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidCatch(error) {
        this.setState({ error });
    }
    unstable_handleError(error) { // eslint-disable-line camelcase
        this.setState({ error });
    }
    render() {
        return this.state.error?
            <pre>{this.state.error.message}</pre> :
            this.props.children;
    }
}

describe('Entity without declaration', () => {
    it('Block without declaration should have proper CSS class', () => {
        expect(getClassName(<Bem block="Block"/>))
            .toBe('Block');
    });

    it('Block without declaration with mods should have proper CSS class', () => {
        expect(getClassNames(<Bem block="Block" mods={{ a : true, b : 1 }}/>))
            .toEqual(arrayPart(['Block_a', 'Block_b_1']));
    });

    it('Elem without declaration should have proper CSS class', () => {
        expect(getClassName(<Bem block="Block" elem="Elem"/>))
            .toBe('Block-Elem');
    });

    it('Elem without declaration with mods should have proper CSS class', () => {
        expect(getClassNames(<Bem block="Block" elem="Elem" mods={{ a : true, b : 1 }}/>))
            .toEqual(arrayPart(['Block-Elem_a', 'Block-Elem_b_1']));
    });

    it('Elem without declaration with elemMods should have proper CSS class and ignore mods', () => {
        const classNames = getClassNames(
            <Bem
                block="Block"
                elem="Elem"
                mods={{ a : true, b : 1 }}
                elemMods={{ b : 2 }}/>
        );

        expect(classNames).toContain('Block-Elem_b_2');
        expect(classNames).not.toEqual(arrayPart(['Block-Elem_a', 'Block-Elem_b_1']));
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
            .toEqual(arrayPart(['Block2', 'Block2_mod1_val1']));
    });

    it('Block should support nested mixes as object', () => {
        expect(getClassNames(<Bem block="Block" mix={{
            block : 'MixedInstance',
            mods : { mod : 'val' },
            mix : {
                block : 'Nested',
                mods : { mod : 'val' },
                mix : { block : 'NestedSimple' }
            } }}/>))
            .toEqual(arrayPart([
                'Block', 'MixedInstance', 'MixedInstance_mod_val', 'Nested', 'Nested_mod_val', 'NestedSimple'
            ]));
    });

    it('Block should support nested mixes as instance', () => {
        expect(getClassNames(<Bem block="Block" mix={<MixedInstance mod="val"/>}/>))
            .toEqual(arrayPart([
                'Block', 'MixedInstance', 'MixedInstance_mod_val', 'Nested', 'Nested_mod_val', 'NestedSimple'
            ]));
    });

    it('Elem should allow adding mix', () => {
        expect(getClassNames(
            <Bem block="Block" elem="Elem" mix={{ block : 'Block2', elem : 'Elem2' }}/>
        )).toContain('Block2-Elem2');

        expect(getClassNames(
            <Bem
                block="Block"
                elem="Elem"
                mix={[{
                    block : 'Block2',
                    elem : 'Elem2',
                    mods : { mod1 : 'val1' } }]}/>
        )).toEqual(arrayPart(['Block2-Elem2', 'Block2-Elem2_mod1_val1']));

        expect(getClassNames(
            <Bem
                block="Block"
                elem="Elem"
                mix={[{
                    block : 'Block2',
                    elem : 'Elem2',
                    mods : { mod1 : 'val1' },
                    elemMods : { mod2 : 'val2' } }]}/>
        )).toEqual(arrayPart(['Block2-Elem2', 'Block2-Elem2_mod2_val2']));
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
            expect(mount(
                <Boundary>
                    <Bem elem="Elem2"/>
                </Boundary>
            ).text()).toBe('Can\'t get block from context');
        });

        it('Elem should throw exception in case of undefined elem', () => {
            expect(mount(
                <Bem block="Block">
                    <Boundary>
                        <Bem/>
                    </Boundary>
                </Bem>
            ).text()).toBe('Prop elem must be specified');
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
        expect(getClassNames(<MyBlock disabled/>))
            .toEqual(arrayPart(['MyBlock_disabled', 'MyBlock_a', 'MyBlock_b_1']));
    });

    it('Block should have CSS classes in accordance with simple predicate', () => {
        expect(getClassNames(<MyBlock simpleMod/>))
            .toEqual(arrayPart(['MyBlock_a', 'MyBlock_simpleMod']));
    });

    it('Block should have CSS classes in accordance with any mod val predicate', () => {
        expect(getClassNames(<MyBlock anyModVal="red"/>))
            .toEqual(arrayPart(['MyBlock_a', 'MyBlock_anyModVal_red']));
    });

    it('Block should have CSS classes in accordance with custom mod val predicate', () => {
        expect(getClassNames(<MyBlock customModVal="button"/>))
            .toEqual(arrayPart(['MyBlock_a', 'MyBlock_customModVal_button']));
    });

    it('Block should have CSS classes in accordance with multi mod val predicate', () => {
        expect(getClassNames(<MyBlock multiMod1="val1" multiMod2="val2"/>))
            .toEqual(arrayPart(['MyBlock_a', 'MyBlock_multiMod1_val1', 'MyBlock_multiMod2_val2']));
    });

    it('Block should have CSS classes in accordance with merge of predicate and declared mode', () => {
        expect(getClassNames(<MyBlock firstMod="first"/>))
            .toEqual(arrayPart(['MyBlock_a', 'MyBlock_firstMod_first', 'MyBlock_secondMod_second']));
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
            .toEqual(arrayPart(['Block2', 'Block2_mod1_val1']));
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
        )).toEqual(arrayPart(['Block2-Elem2', 'Block2-Elem2_mod1_val1']));
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

    it('Inherited Elem should have proper CSS class', () => {
        expect(getClassName(<InheritedElem/>))
            .toBe('MyBlock-Elem InheritedBlock-IElem MyBlock-Elem_a MyBlock-Elem_b_1');
    });

    it('Inherited Elem from Block should have proper CSS class', () => {
        expect(getClassName(<InheritedElemFromBlock/>))
            .toBe('BlockWithDeclaredMix InheritedBlock-ElemFromBlock Mixed');
    });

    it('Should allow to set custom naming', () => {
        expect(getClassName(<AnotherNamingBlockElem/>))
            .toBe('another-naming-block__elem another-naming-block__elem--try');
    });
});

describe('Inherited block should have proper CSS class', () => {
    it('In case of undeclared modifiers', () => {
        expect(getClassName(<SimpleInheritedBlock/>))
            .toBe('SimpleBlock SimpleInheritedBlock');
    });

    it('In case of declared modifiers', () => {
        expect(getClassName(<InheritedBlock/>))
            .toBe('MyBlock InheritedBlock MyBlock_a' +
                ' InheritedBlock_a MyBlock_b_1 InheritedBlock_b_1 InheritedBlock_inInheritedBlock');
    });
});

function getClassNames(node) {
    return getClassName(node).split(' ');
}

function getClassName(node) {
    return shallow(node).props().className;
}
