import { decl } from 'bem-react-core';
import BlockWithDeclaredMix from 'b:BlockWithDeclaredMix';

export default decl(BlockWithDeclaredMix, {
    block : 'InheritedBlock',
    elem : 'ElemFromBlock'
});
