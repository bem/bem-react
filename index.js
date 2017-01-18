import decls from './lib/decls';
import BaseComponent from './lib/BaseComponent';
import ClassNameBuilder from './lib/ClassNameBuilder';
import simpleComponent from './lib/simpleComponent';

const defaultNaming = new ClassNameBuilder({
        elementSeparator : '-',
        modSeparator : '_',
        modValueSeparator : '_'
    }),
    defaultDecls = decls({}, BaseComponent, defaultNaming);

export const { decl, declMod } = defaultDecls;
export default simpleComponent(defaultNaming);
