import { declMod } from 'bem-react-core';
import { PropTypes } from 'react';

export default declMod(({ theme }) => theme === 'simple', {
    block : 'MyBlock',
    mods({ theme, size }) {
        return {
            ...this.__base.apply(this, arguments),
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
    }
});
