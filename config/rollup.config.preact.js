import replace from 'rollup-plugin-replace';
import { config, output } from './rollup.config.common';

export default [{
    ...config,
    output : {
        ...output,
        format : 'cjs',
        sourcemap : true,
        file : 'dist/preact.dev.js'
    }
}, {
    ...config,
    output : {
        ...output,
        format : 'umd',
        globals : {
            preact : 'Preact',
            proptypes : 'PropTypes'
        },
        file : 'umd/preact.js'
    },
    plugins : [].concat(config.plugins, replace({
        'process.env.BEM_NAMING' : 0
    }))
}].map(c => ({
    ...c,
    input : 'src/presets/Preact.js',
    external : ['preact', 'proptypes']
}));


