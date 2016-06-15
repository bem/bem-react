var jsLoaders = ['babel'];

module.exports = {
    entry : __dirname + '/index.js',
    output : {
        path : __dirname,
        filename : '_index.js'
    },
    module : {
        loaders: [
            { test : /\.js$/, loaders : jsLoaders }
        ]
    }
};
