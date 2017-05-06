import inherit from 'inherit';
import renderTag from './renderTag';
import ClassNameBuilder from './ClassNameBuilder';

export default inherit({
    __constructor() {
        this.__base(...arguments);
        this.__cnb = new ClassNameBuilder(this.__self.__dangerouslySetNaming);
        this.__render = renderTag(this.__cnb);
    }
}, {
    __dangerouslySetNaming : {
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    }
});
