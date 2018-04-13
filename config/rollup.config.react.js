import replace from 'rollup-plugin-replace';
import { config, output } from './rollup.config.common';

export default [{
    ...config,
    output: {
        ...output,
        format: 'cjs',
        sourcemap: true,
        file: 'packages/react/lib/index.all.js'
    }
}, {
    ...config,
    output: {
        ...output,
        format: 'umd',
        globals: {
            react: 'React'
        },
        file: 'packages/react/umd/index.js'
    },
    plugins: [].concat(config.plugins, replace({
        'process.env.NODE_ENV': 'production'
    }))
}].map(c => ({
    ...c,
    input: 'packages/react/lib/index.js',
    external: ['react']
}));
