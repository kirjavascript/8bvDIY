var webpack = require('webpack');
var copy = require("copy-webpack-plugin");

module.exports = {
    entry : [
        './modules/js/index.js',
    ],
    output: {
        path:     'static',
        //publicPath: 'data',
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            {
                test:   /\.js/,
                loader: 'babel',
                include: __dirname + '/modules/js',
                query: {
                    presets: ['es2015'],
                }
            },
            {
                test: /\.scss/,
                loader: 'style!css!sass!import-glob'
            }
        ],
    },
    plugins: [
        new copy([
            { from: './templates', to: '.'},
        ]),
        // new webpack.ProvidePlugin({
        //     $: "jquery",
        //     jQuery: "jquery"
        // })
    ],
};
