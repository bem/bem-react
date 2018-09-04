module.exports = {
    name: 'BEM React: API Reference',
    theme: 'minimal',
    out: './reference',
    readme: './docs/ru/README.md',
    mode: 'file',
    exclude: '**/node_modules',
    ignoreCompilerErrors: true,
    excludeNotExported: true,
    hideGenerator: true,
    slt: '@bem-react/classname,@bem-react/core,@bem-react/di'
};
