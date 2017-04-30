import { decl } from 'bem-react-core';
import PropTypes from 'prop-types';
import 'm:mod';

export default decl({
    block : 'BlockWithRequiredMod',
    content : '1'
}, {
    propTypes : {
        mod : PropTypes.bool
    },
    defaultProps : {
        mod : true
    }
});
