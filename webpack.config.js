const path = require('path');

module.exports = {
    entry: './.js/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'   //what output does it create
  },
  watchOptions: {
    poll: true
  },
  module: {               //how does it bundle the code
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['react']
        }
      }
    }]
  }
}
