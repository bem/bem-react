import decls from './decls';
import BaseComponent from './BaseComponent';
import ClassNameBuilder from './ClassNameBuilder';
import simpleComponent from './simpleComponent';

const defaultNaming = new ClassNameBuilder({
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    }),
    defaultDecls = decls({}, BaseComponent, defaultNaming);

export const { decl, declMod } = defaultDecls;
export default simpleComponent(defaultNaming);
