const path = require('path')
const pkg = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'
const libraryName = pkg.name

process.stdout.write(`\nisProduction: ${isProduction}\n`)

module.exports = {
  entry: path.join(__dirname, 'src', 'EventHandler.js'),
  mode: isProduction ? 'production' : 'development',
  optimization: {
    minimize: false
  },
  devtool: isProduction ? undefined : 'inline-source-map',
  output: {
    filename: `${libraryName}.js`,
    path: path.join(__dirname, 'lib'),
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true,
    // Issue described at https://github.com/webpack/webpack/issues/6525
    // Solution provided by https://github.com/webpack/webpack/issues/6522#issuecomment-371120689
    globalObject: 'typeof self !== \'undefined\' ? self : this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {}
        }
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
          options: {
            configFile: path.join(__dirname, '.eslintrc.json')
          }
        }
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
}
