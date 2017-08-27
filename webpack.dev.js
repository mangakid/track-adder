const webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('public/style.css', {
            allChunks: true
        })
  ],
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loaders: [
          'react-hot-loader/webpack',
          'babel?presets[]=es2015,presets[]=react,presets[]=react-hmre'
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('css!sass')
      }
    ]
  },
};
