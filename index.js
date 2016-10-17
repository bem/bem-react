import bemReactCore from './lib';
import Base from './lib/Base';
import ClassBuilder from './lib/ClassBuilder';
import inlineBem from './lib/inlineBem';

const defaultClassBuilder = new ClassBuilder({
    elementSeparator : '-',
    modSeparator : '_',
    modValueSeparator : '_'
});
const Bem = inlineBem(defaultClassBuilder);
const defaultCore = bemReactCore(
    {/* default options */}, Bem, Base, defaultClassBuilder
);

export const {decl, declMod} = defaultCore;
export default Bem;
