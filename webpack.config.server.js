const nodeExternals = require('webpack-node-externals')

module.exports = {
  name: 'server',
  mode: 'development',
  entry: './server/src/server.js',
  target: 'node',
  output: {
    path: `${__dirname}/build`,
    filename: 'server.bundle.js',
  },
  externals: [nodeExternals()], // in order to ignore all modules in node_modules folder
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
}
