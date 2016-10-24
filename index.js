import bemReactCore from './lib';
import BaseComponent from './lib/BaseComponent';
import ClassNameBuilder from './lib/ClassNameBuilder';
import simpleComponent from './lib/simpleComponent';

const defaultNaming = new ClassNameBuilder({
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    }),
    defaultCore = bemReactCore({}, BaseComponent, defaultNaming);

export const {decl, declMod} = defaultCore;
export default simpleComponent(defaultNaming);
