import decls from './decls';
import BaseComponent from './BaseComponent';
import simpleComponent from './simpleComponent';
import bemConfig from '../.bemrc.js';

// TODO: It's preparation for the future,
// when bem-config can be resolved for the browser.
// https://github.com/bem-sdk/bem-config/issues/20
const opts = {
    __dangerouslySetNaming : bemConfig.modules['bem-react-core'].naming
};

export const { decl, declMod } = decls(BaseComponent, {}, opts);
export default simpleComponent({}, opts);
