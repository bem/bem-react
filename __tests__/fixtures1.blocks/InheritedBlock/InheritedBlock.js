import { decl } from 'bem-react-core';
import PropTypes from 'prop-types';
import MyBlock from 'b:MyBlock';

export default decl(MyBlock, {
    block : 'InheritedBlock'
}, {
    propTypes : {
        checked : PropTypes.bool
    },
    defaultProps : {
        checked : false
    }
});
