import {decl} from 'bem-react-core';
import MyBlock from 'b:MyBlock';

export default decl(MyBlock, {
    block : 'MyDerivedBlock',
    cls : 'add-cls',
    onClick(e) {
        this.__base.apply(this, arguments);
        console.log(this.block);
    }
});
