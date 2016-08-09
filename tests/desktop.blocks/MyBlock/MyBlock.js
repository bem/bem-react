import {decl} from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    onClick(e) {
        this.__base.apply(this, arguments);
        console.log('other-level');
    }
});
