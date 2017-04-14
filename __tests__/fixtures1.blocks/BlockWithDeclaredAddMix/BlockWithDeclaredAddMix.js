import { decl } from 'bem-react-core';

export default decl({
    block : 'BlockWithDeclaredAddMix',
    addMix() {
        return { block : 'Mixed' };
    }
});
