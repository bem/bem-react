import { declMod } from 'bem-react-core';
import PropTypes from 'prop-types';

export default declMod(({ theme }) => theme === 'simple', {
    block : 'MyBlock',
    tag : 'span',
    mods({ theme, size }) {
        return {
            ...this.__base(...arguments),
            theme,
            size
        };
    }
}, {
    propTypes : {
        theme : PropTypes.string,
        size : PropTypes.string
    },
    defaultProps : {
        size : 'm'
    },
    contextTypes : {
        context1 : PropTypes.bool,
        context2 : PropTypes.string
    },
    childContextTypes : {
        context1 : PropTypes.bool,
        context2 : PropTypes.string
    }
});
