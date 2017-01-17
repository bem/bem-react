import React from 'react';
import { decl } from 'bem-react-core';
import MyElem from 'b:MyBlock e:MyElem';

export default decl({
    block : 'OtherBlock',
    elem : 'OtherElem',
    content() {
        return (
            <MyElem />
        );
    }
});
