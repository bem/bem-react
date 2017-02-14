import { decl } from 'bem-react-core';
import MyBlock from 'b:MyBlock';
import SimpleBlock from 'b:SimpleBlock';

export default decl([MyBlock, SimpleBlock], {
    block : 'BlockWithMixins'
});
