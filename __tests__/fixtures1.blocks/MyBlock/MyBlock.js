import { decl } from 'bem-react-core';
import { PropTypes } from 'react';

export default decl({
    block : 'MyBlock',
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
    }
});
