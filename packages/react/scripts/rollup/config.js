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
    name: 'bem-react-core',
    entry: 'src/index.ts',
    typings: 'typings',
    bundleTypes: [
        BUNDLE_TYPES.NODE_DEV,
        BUNDLE_TYPES.NODE_PROD
    ],
    externals: [
        '@bem/sdk.entity-name',
        '@bem/sdk.naming.entity.stringify',
        '@bem/sdk.naming.presets',
        'object-assign',
        'react'
    ]
};

module.exports.BUNDLE_TYPES = BUNDLE_TYPES;
module.exports.bundleConfig = bundleConfig;
