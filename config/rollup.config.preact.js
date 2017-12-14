import { config, output } from './rollup.config.common';

export default [{
    ...output,
    format : 'cjs',
    sourcemap : true,
    file : 'dist/index.preact.dev.js'
}, {
    ...output,
    format : 'umd',
    globals : {
        preact : 'Preact',
        proptypes : 'PropTypes'
    },
    file : 'umd/index.preact.js'
}].map(output => ({
    ...config,
    input : 'src/presets/Preact.js',
    external : ['preact', 'proptypes'],
    output
}));


