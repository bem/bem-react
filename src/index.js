import decls from './decls';
import BaseComponent from './BaseComponent';
import simpleComponent from './simpleComponent';

const defaultDecls = decls({}, BaseComponent);

export const { decl, declMod } = defaultDecls;
export default simpleComponent();
