import React from 'react';
import Bem, {decl} from 'bem-react-core';
import MyBlock from 'b:MyBlock m:myMod';
import MyDerivedBlock from 'b:MyDerivedBlock';
import OtherBlock from 'b:OtherBlock';
import 'b:OtherBlock e:OtherElem';
import RootElem from 'e:RootElem';

export default decl({
    block : 'Root',
    willInit() {
        this.state = { value : '567' };
    },
    content() {
        return [
            <MyBlock key="1">
                <Bem block="InlineBlock" elem="Elem" mods={{ a : 'b' }}>InlineBlock</Bem>
            </MyBlock>,
            <MyBlock key="2" disabled>321</MyBlock>,
            ' ',
            <MyBlock key="3" myMod>myMod</MyBlock>,
            ' ',
            <MyDerivedBlock key="4">MyDerivedBlock</MyDerivedBlock>,
            <OtherBlock
                key="5"
                value={this.state.value}
                mix={{ block : 'OuterMixedBlock', elem : 'Elem' }}
                onChange={({ target }) => this.setState({ value : target.value }) }/>,
            <Bem block={this} elem="RootElem" key="6" mods={{ a : 'b' }}>RootElem</Bem>,
            <Bem block={this.__self} elem="OtherElem" key="8">OtherElem 1</Bem>,
            <Bem block="OtherBlock" elem="OtherElem" key="9">OtherElem 2</Bem>,
        ];
    }
});
