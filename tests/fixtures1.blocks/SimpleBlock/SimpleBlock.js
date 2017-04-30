import { decl } from 'bem-react-core';

export default decl({
    block : 'SimpleBlock',
    attrs({ id }) {
        return { id };
    }
});
