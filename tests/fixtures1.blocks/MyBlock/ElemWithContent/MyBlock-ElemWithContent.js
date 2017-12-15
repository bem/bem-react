import React from 'react';
import { Bem, decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    elem : 'ElemWithContent',
    content : <Bem elem="InnerElem"/>
});
