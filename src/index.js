import decls from './decls';
import BaseComponent from './BaseComponent';
import simpleComponent from './simpleComponent';

export const { decl, declMod } = decls(BaseComponent/*, { overrides }*/);
export default simpleComponent(/*{ overrides }*/);
