import renderTag from './renderTag';
import ClassNameBuilder from './ClassNameBuilder';

export default {
    __constructor() {
        this.__base(...arguments);
        this.__cnb = new ClassNameBuilder(this.__dengerouslyNamingSettings);
        this.__render = renderTag(this.__cnb);
    },

    __dengerouslyNamingSettings : {
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    }
};
