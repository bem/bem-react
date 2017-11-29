import { decl } from 'bem-react-core';
import PropTypes from 'prop-types';
import MyBlock from 'b:MyBlock';

export default decl(MyBlock, {
    block : 'InheritedBlock',
    mods() {
        console.log('this', this);
        return {
            ...this.__base(...arguments),
            inInheritedBlock : true
        };
    }
}, {
    propTypes : {
        checked : PropTypes.bool
    },
    defaultProps : {
        checked : false
    },
    contextTypes : {
        context1 : PropTypes.bool,
        context4 : PropTypes.string
    },
    childContextTypes : {
        context1 : PropTypes.bool,
        context4 : PropTypes.string
    }
});
