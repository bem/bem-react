import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import babelCommon from './babel.common';

export const config = {
    strict : true,
    plugins : [
        nodeResolve({ main : true }),
        babel(Object.assign({}, {
            babelrc : false,
            sourceMap : true
        }, babelCommon)),
        commonjs()
    ]
};

export const output = {
    name : 'BemReactCore',
    exports : 'named'
};
