const path = require('path');
const webpack = require('webpack');

const baseConfig = {
  module: {
    rules: [
      {
        test: /(\.jsx)|(\.js)$/,
        exclude: /node-modules/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'example'),
    port: 9000,
    hot: true,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
};

const config = Object.assign({
  entry: {
    calendar: './example/calendar.js'
  },
  output: {
    path: path.resolve(__dirname, 'example'),
    filename: '[name].bundle.js'
  },
  mode: 'development'
}, baseConfig);

module.exports = config;