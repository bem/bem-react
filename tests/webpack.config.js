module.exports = {
    entry : `${__dirname}/desktop.bundles/index/index.js`,
    output : {
        path : `${__dirname}/desktop.bundles/index/`,
        publicPath : `/desktop.bundles/index/`,
        filename : '_index.js'
    },
    module : {
        loaders: [
            {
                test : /\.js$/,
                exclude : /node_modules/,
                loaders : ['babel']
            },
            {
                test : /\.css$/,
                loaders : ['style', 'css']
            }
        ]
    }
};
