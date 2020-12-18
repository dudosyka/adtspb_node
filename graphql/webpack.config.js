module.exports = {
  entry: './app.js',
  target: 'node',
  output: {
    filename: './app.js',
    library: 'myApp'
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: false
  }
//  optimization: {
//     splitChunks: {
//       chunks: 'all',
//     },
//   },
};
