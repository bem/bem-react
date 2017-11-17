import { decl } from 'bem-react-core';

export default decl({
    block : 'SimpleBlock',
    attrs({ ariaLabelledBy, id }) {
        return { 'aria-labelledby' : ariaLabelledBy, id };
    }
});
