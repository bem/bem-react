import React from 'react';
import Bem, {decl} from '../../../';
import MyBlock from 'b:MyBlock m:myMod m:myModWithVal=valOne';
import MyDerivedBlock from 'b:MyDerivedBlock';
import OtherBlock from 'b:OtherBlock';
import WrappedBlock from 'b:WrappedBlock';
import 'b:OtherBlock e:OtherElem';
import 'e:RootElem';

export default decl({
    block : 'Root',
    willInit() {
        this.state = { value : '567' };
    },
    content() {
        return [
            <MyBlock key="1">
                <Bem block="InlineBlock" elem="Elem" mods={{ a : 'b' }} mix={{block: 'YetAnBlock', elem: 'Yep'}}>InlineBlock</Bem>
            </MyBlock>,
            <MyBlock key="2" disabled>321</MyBlock>,
            ' ',
            <MyBlock key="3" myMod>myMod</MyBlock>,
            ' ',
            <MyBlock key="4" myModWithVal="valOne">myModWithVal valOne</MyBlock>,
            ' ',
            <MyDerivedBlock key="5">MyDerivedBlock</MyDerivedBlock>,
            <OtherBlock
                key="6"
                value={this.state.value}
                mix={{ block : 'OuterMixedBlock', elem : 'Elem' }}
                otherMod
                onChange={({ target }) => this.setState({ value : target.value }) }/>,
            <Bem block={this} elem="RootElem" key="7" mods={{ a : 'b' }}>RootElem</Bem>,
            <Bem block={this.__self} elem="OtherElem" key="8">OtherElem 1</Bem>,
            <Bem block="OtherBlock" elem="OtherElem" key="9">OtherElem 2</Bem>,
            <WrappedBlock key="10">wrapped block</WrappedBlock>,
        ];
    }
});
