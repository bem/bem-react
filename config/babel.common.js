export default {
    plugins: ['transform-object-assign', 'external-helpers'],
    presets: [
        ['env', {
            loose: true,
            modules: false,
            exclude: [
                'transform-es2015-typeof-symbol',
                'babel-plugin-transform-async-to-generator'
            ],
            targets: { browsers: ['last 2 versions', 'IE >= 9'] }
        }]
    ]
};
