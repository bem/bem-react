import { decl } from 'bem-react-core';
import { PropTypes } from 'react';

export default decl({
    block : 'MyBlock'
}, {
    propTypes : {
        a11y : PropTypes.bool
    },
    defaultProps : {
        a11y : false
    }
});
