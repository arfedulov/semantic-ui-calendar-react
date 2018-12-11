const path = require('path');
const webpack = require('webpack');

const config = {
  entry: {
    calendar: './example/calendar.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'example'),
    filename: '[name].bundle.js',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node-modules/,
        loader: 'ts-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /node-modules/,
        loader: 'babel-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', 'jsx']
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'example'),
    port: 9000,
    hot: true,
  },
  devtool: 'source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
};

module.exports = config;
