import { decl } from 'bem-react-core';

export default decl({
    block : 'MyBlock',
    elem : 'Elem',
    mods({ disabled }) {
        return {
            disabled,
            a : true,
            b : 1
        };
    }
});
