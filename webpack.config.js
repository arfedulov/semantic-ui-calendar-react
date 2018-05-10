const path = require('path');
const baseConfig = require('./webpack.base.config.js');

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