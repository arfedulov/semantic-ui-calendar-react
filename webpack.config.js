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
            plugins: [
              'transform-react-handled-props',
              'transform-react-jsx-source'
            ]
          }
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'example'),
    port: 9000
  }
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