import { declMod } from 'bem-react-core';

export default declMod({ cancel : 'wrap' }, {
    block : 'WrappedBlock',

    wrap(props, state, component) {
        return component;
    }
});
