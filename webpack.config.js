const webpack = require('webpack')
const pjson = require('./package.json')
const CopyWebpackPlugin = require('copy-webpack-plugin')

function getDateTimeStamp() {
  const now = new Date()
  const date = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')
  const time = now
    .toISOString()
    .slice(11, 19)
    .replace(/:/g, '')

  return date + time
}

const plugins = []

plugins.push(
  new webpack.DefinePlugin({
    SJS_NAME: JSON.stringify(pjson.name),
    SJS_VERSION: JSON.stringify(pjson.version),
    SJS_BUILD: JSON.stringify(getDateTimeStamp()),
  }),
)

plugins.push(new CopyWebpackPlugin({
    patterns: [
      { from: 'vendor/', to: 'lib/' }
    ]
  })
)

module.exports = {
  context: __dirname,
  dependencies: [ 'node_modules', 'bower_components', 'vendor' ],
  entry: `${__dirname}/src/index.js`,
  optimization: {
    minimize: false,
  },
  output: {
    path: `${__dirname}/src/client/dist/`,
    publicPath: '/dist/',
    filename: 'strike.js',
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components|vendor)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ],
          },
        },
      },
    ],
  },
}
