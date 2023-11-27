const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  name: 'client',
  mode: 'development',
  entry: './client/src/client.js',
  output: {
    path: `${__dirname}/build`,
    filename: 'client.bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },
  plugins: [new NodePolyfillPlugin()],
}
