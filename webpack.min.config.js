const config = require('./webpack.config')

config.output.filename = 'strike.min.js'
config.optimization.minimize = true

module.exports = config
