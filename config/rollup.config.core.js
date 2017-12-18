import { config } from './rollup.config.common';

export default [{
    ...config,
    output : {
        format : 'cjs',
        sourcemap : true,
        file : 'dist/core.js'
    }
}, {
    ...config,
    output : {
        name : 'Core',
        format : 'umd',
        file : 'umd/core.js'
    }
}].map(c => ({
    ...c,
    input : 'src/Core.js'
}));
