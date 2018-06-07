import { decl } from 'bem-react-core';
import SimpleBlockWithMods from 'b:SimpleBlockWithMods';

export default decl(SimpleBlockWithMods, {
    block : 'SimpleInheritedBlockWithMods',
    mods() {
        return this.__base(...arguments);
    }
});
