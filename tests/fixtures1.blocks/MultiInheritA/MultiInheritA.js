import { decl } from 'bem-react-core';

export default decl({
    block : 'MultiInheritA',
    content() {
        return [
            this.__base(...arguments),
            '0'
        ];
    }
});
