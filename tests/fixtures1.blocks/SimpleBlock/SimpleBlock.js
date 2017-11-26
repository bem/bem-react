import { decl } from 'bem-react-core';

export default decl({
    block : 'SimpleBlock',
    willInit() {
        this.state = { name : 'name' };
    },
    attrs({ ariaLabelledBy, id }, { name }) {
        return { 'aria-labelledby' : ariaLabelledBy, id, name };
    }
});
