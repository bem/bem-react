import { decl } from 'bem-react-core';

export default decl({
    block : 'BlockWithStyle',
    attrs : { style : { font : 'bold', color : 'green' } },
    style : { color : 'red', background : 'blue' }
});
