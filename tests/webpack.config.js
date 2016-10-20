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
                loaders : ['webpack-bem', 'babel']
            },
            {
                test : /\.css$/,
                loaders : ['style', 'css']
            }
        ]
    },
    resolve: {
        alias: {
            'bem-react-core' : require.resolve(`${__dirname}/../`)
        }
    },
    bemLoader : {
        techs : ['js', 'css'], // NOTE: order is very important! JS first!!
        levels : [
            `${__dirname}/common.blocks`,
            `${__dirname}/desktop.blocks`
        ]
    }
};
