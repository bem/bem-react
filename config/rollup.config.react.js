import { config, output } from './rollup.config.common';

export default [{
    ...output,
    format : 'cjs',
    sourcemap : true,
    file : 'dist/index.react.dev.js'
}, {
    ...output,
    format : 'umd',
    globals : {
        react : 'React',
        'prop-types' : 'PropTypes'
    },
    file : 'umd/index.react.js'
}].map(output => ({
    ...config,
    input : 'src/presets/React.js',
    external : ['react', 'prop-types'],
    output
}));
