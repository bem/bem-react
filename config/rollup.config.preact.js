import replace from 'rollup-plugin-replace';
import { config, output } from './rollup.config.common';

export default [{
    ...config,
    output: {
        ...output,
        format: 'cjs',
        sourcemap: true,
        file: 'packages/preact/lib/index.all.js'
    }
}, {
    ...config,
    output: {
        ...output,
        format: 'umd',
        globals: {
            preact: 'Preact'
        },
        file: 'packages/preact/umd/index.js'
    },
    plugins: [].concat(config.plugins, replace({
        'process.env.NODE_ENV': 'production'
    }))
}].map(c => ({
    ...c,
    input: 'packages/preact/lib/index.js',
    external: ['preact', 'proptypes']
}));


