import inherit from 'inherit';
import renderTag from './renderTag';
import ClassNameBuilder from './ClassNameBuilder';

export default inherit({
    __constructor() {
        this.__base(...arguments);
        this.__cnb || (this.__cnb = this.__self.classNameBuilder());
        this.__render = renderTag(this.__cnb);
    }
}, {
    __dangerouslySetNaming : {
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    },
    classNameBuilder() {
        return new ClassNameBuilder(this.__dangerouslySetNaming);
    },
    displayName(block, elem) {
        this.__cnb || (this.__cnb = this.classNameBuilder());
        return this.__cnb.stringify(block, elem);
    }
});
