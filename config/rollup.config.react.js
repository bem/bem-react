import replace from 'rollup-plugin-replace';
import { config, output } from './rollup.config.common';

export default [{
    ...config,
    output : {
        ...output,
        format : 'cjs',
        sourcemap : true,
        file : 'dist/react.dev.js'
    }
}, {
    ...config,
    output : {
        ...output,
        format : 'umd',
        globals : {
            react : 'React',
            'prop-types' : 'PropTypes'
        },
        file : 'umd/react.js'
    },
    plugins : [].concat(config.plugins, replace({
        'process.env.BEM_NAMING' : 0
    }))
}].map(c => ({
    ...c,
    input : 'src/presets/React.js',
    external : ['react', 'prop-types']
}));
