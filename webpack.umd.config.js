const path = require('path');

const config = {
  entry: {
    index: './src/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'umd'),
    library: 'semantic-ui-calendar-react',
    libraryTarget: 'umd',
    filename: 'semantic-ui-calendar-react.js',
  },
  mode: 'production',
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
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js', 'jsx'],
  },
  devtool: 'source-map',
};

module.exports = config;
