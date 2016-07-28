import {decl} from 'bem-react-core';
import 'm:otherMod';

export default decl({
    block : 'OtherBlock',
    tag : 'input',
    mix : [{ block : 'YetAnotherBlock' }, { elem : 'elem' }],
    mods : { otherMod : true },
    attrs({ value, onChange }) {
        return {
            value,
            onChange
        };
    }
});
