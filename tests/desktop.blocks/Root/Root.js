import React from 'react';
import Bem, { decl } from 'bem-react-core';
import MyBlock from 'b:MyBlock m:myMod m:myModWithVal=valOne';
import MyDerivedBlock from 'b:MyDerivedBlock';
import OtherBlock from 'b:OtherBlock';
import WrappedBlock from 'b:WrappedBlock';
import 'b:OtherBlock e:OtherElem';

export default decl({
    block : 'Root',
    willInit() {
        this.state = { value : '567' };
    },
    onChange({ target }) {
        this.setState({ value : target.value });
    },
    content() {
        return [
            <MyBlock key="1">
                <Bem
                    block="InlineBlock"
                    elem="Elem"
                    mods={{ a : 'b' }}
                    mix={{ block : 'YetAnBlock', elem : 'Yep' }}>
                        InlineBlock
                  </Bem>
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
                onChange={this.onChange}/>,
            <Bem
                block={this}
                elem="RootElem"
                key="6"
                mods={{ a : 'b' }}>
                  RootElem
            </Bem>,
            <Bem block={this.__self} elem="OtherElem" key="7">OtherElem 1</Bem>,
            <Bem block="OtherBlock" elem="OtherElem" key="8">OtherElem 2</Bem>,
            <WrappedBlock key="9">wrapped block</WrappedBlock>
        ];
    }
});
