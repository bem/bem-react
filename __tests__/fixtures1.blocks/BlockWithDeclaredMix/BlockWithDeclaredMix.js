import { decl } from 'bem-react-core';

export default decl({
    block : 'BlockWithDeclaredMix',
    mix() {
        return { block : 'YET' };
    }
});
