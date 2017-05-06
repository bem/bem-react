import renderTag from './renderTag';
import ClassNameBuilder from './ClassNameBuilder';

export default {
    __constructor() {
        this.__base(...arguments);
        this.__cnb = new ClassNameBuilder(this._naming);
        this.__render = renderTag(this.__cnb);
    },

    _naming : {
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    }
};
