const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: ["react-hot-loader/patch", "./src/app.js"]
  },
  output: {
    path: __dirname,
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          { loader: "react-hot-loader/webpack" },
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/react"],
              plugins: [
                "@babel/plugin-proposal-class-properties",
                "@babel/plugin-transform-destructuring",
                "@babel/plugin-proposal-object-rest-spread"
              ]
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: ["css-loader", "sass-loader"]
        })
      }
    ]
  },

  devServer: {
    historyApiFallback: true,
    hot: true,
    inline: true,
    stats: "errors-only",
    host: process.env.HOST,
    port: process.env.PORT
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin("./css/base.css")
  ]
};
