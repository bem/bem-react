import { declMod } from 'bem-react-core';

export default declMod({ customModVal : ({ customModVal }) => customModVal === 'button' }, {
    block : 'MyBlock',
    tag : 'button'
});
