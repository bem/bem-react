import { decl } from 'bem-react-core';
import PropTypes from 'proptypes';

export default decl({
    block : 'MyBlock',
    attrs() {
        return { id : this.generateId() };
    },
    mods({ disabled }) {
        return {
            disabled,
            a : true,
            b : 1
        };
    },
    tag : 'a',
    content(_, children) {
        return ['content', children];
    }
}, {
    propTypes : {
        disabled : PropTypes.bool
    },
    defaultProps : {
        disabled : false
    },
    contextTypes : {
        context0 : PropTypes.string,
        context1 : PropTypes.string
    },
    childContextTypes : {
        context0 : PropTypes.string,
        context1 : PropTypes.string
    }
});
