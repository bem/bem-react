import decls from './decls';
import BaseComponent from './BaseComponent';
import simpleComponent from './simpleComponent';

export const { decl, declMod } = decls(BaseComponent/*, { override base }, { override static } */);
export default simpleComponent(/*, { override base }, { override static } */);
