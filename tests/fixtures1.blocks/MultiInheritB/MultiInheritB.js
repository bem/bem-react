import { decl } from 'bem-react-core';

export default decl({
    block : 'MultiInheritB',
    content() {
        return [
            this.__base(...arguments),
            '1'
        ];
    }
});
