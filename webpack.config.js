const path = require('path');

const baseConfig = {
  module: {
    rules: [
      {
        test: /(\.jsx)|(\.js)$/,
        exclude: /node-modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'stage-0', 'react'],
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    port: 9000
  }
};

const config = Object.assign({
  entry: {
    base: './src/index.js',
    test: './src/test.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  mode: 'development'
}, baseConfig);

module.exports = config;