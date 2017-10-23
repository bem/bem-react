import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import babelrc from './babelrc';

export default {
    strict : true,
    input : 'src/presets/React.js',
    output : {
        format : 'cjs',
        file : 'dist/index.react.dev.js',
        name : 'BemReactCore',
        sourcemap : true
    },
    external : ['react', 'prop-types'],
    plugins : [
        nodeResolve({ main : true }),
        babel(Object.assign({}, {
            babelrc : false,
            sourceMap : true
        }, babelrc)),
        commonjs()
    ]
};
