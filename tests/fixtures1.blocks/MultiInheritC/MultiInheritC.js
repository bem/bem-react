import { decl } from 'bem-react-core';
import MultiInheritA from 'b:MultiInheritA';
import MultiInheritB from 'b:MultiInheritB';

export default decl([MultiInheritA, MultiInheritB], {
    block : 'MultiInheritC',
    content() {
        return [
            this.__base(...arguments),
            '3'
        ];
    }
});
