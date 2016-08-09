var bemLoader = require.resolve('../webpack/bem-loader');

var jsLoaders = [bemLoader, 'babel'];

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
                loaders : jsLoaders
            },
            {
                test : /\.css$/,
                loaders : ['style', 'css']
            }
        ]
    },
    bemLoader : {
        techs : ['js', 'css'], // NOTE: order is very important! JS first!!
        levels : [
            `${__dirname}/common.blocks`,
            `${__dirname}/desktop.blocks`
        ]
    }
};
