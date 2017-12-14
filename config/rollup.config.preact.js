import replace from 'rollup-plugin-replace';
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
}].map(output => {
    const res = {
        ...config,
        input : 'src/presets/Preact.js',
        external : ['preact', 'proptypes'],
        output
    };

    output.format === 'umd' && res.plugins.push(replace({
        'process.env.BEM_NAMING' : 0
    }));

    return res;
});


