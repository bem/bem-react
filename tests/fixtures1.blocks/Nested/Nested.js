import { decl } from 'bem-react-core';

export default decl({
    block : 'Nested',
    mods({ mod }) {
        return { mod };
    },
    addMix() {
        return { block : 'NestedSimple' };
    }
});
