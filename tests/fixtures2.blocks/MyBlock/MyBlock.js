import { decl } from 'bem-react-core';
import PropTypes from 'proptypes';

export default decl({
    block : 'MyBlock'
}, {
    propTypes : {
        a11y : PropTypes.bool
    },
    defaultProps : {
        a11y : false
    },
    contextTypes : {
        context1 : PropTypes.bool,
        context3 : PropTypes.string
    },
    childContextTypes : {
        context1 : PropTypes.bool,
        context3 : PropTypes.string
    }
});
