import { declMod } from 'bem-react-core';

export default declMod((_, { state }) => state === 'test', {
    block : 'MyBlock',
    tag : 'j'
});
