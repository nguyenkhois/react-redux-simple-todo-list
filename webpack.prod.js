const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = merge(common, {
    mode: 'production',
    plugins: [
        new webpack.DefinePlugin({'process.env.NODE_ENV':JSON.stringify('production')})
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,                
                uglifyOptions: {
                    compress: true,
                    arrows: true,
                    output: {
                        comments: false
                    }
                }
            })
        ]
    }
});