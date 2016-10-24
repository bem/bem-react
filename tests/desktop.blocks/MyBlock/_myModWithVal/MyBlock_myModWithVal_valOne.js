import {declMod} from 'bem-react-core';

export default declMod(({ myModWithVal }) => myModWithVal === 'valOne', {
    block : 'MyBlock',
    didMount() {
        this.__base();
        console.log(`${this.block} with myModWithVal=valOne is mounted`);
    }
});
