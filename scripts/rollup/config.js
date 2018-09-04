'use strict';

const BUNDLE_TYPES = {
    NODE_DEV: {
        minify: false,
        format: 'cjs',
        asserts: true
    },
    NODE_PROD: {
        minify: true,
        format: 'cjs',
        asserts: false
    }
};

const bundleConfig = {
    name: process.env.PKG,
    entry: `./packages/${process.env.PKG}/${process.env.PKG}.tsx`,
    typings: 'typings',
    bundleTypes: [
        BUNDLE_TYPES.NODE_DEV,
        BUNDLE_TYPES.NODE_PROD
    ],
    externals: [
        '@bem/sdk.naming.entity.stringify',
        '@bem/sdk.naming.presets',
        '@bem-react/classname',
        'object-assign',
        'react',
    ]
};

module.exports.BUNDLE_TYPES = BUNDLE_TYPES;
module.exports.bundleConfig = bundleConfig;
