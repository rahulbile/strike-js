module.exports = {
  scripts: {
    lint: 'eslint .',
    test: {
      default: 'jest',
      watch: {
        script: 'jest --watch',
        description: 'run in the amazingly intelligent Jest watch mode'
      }
    },
    serveFixtures: 'babel-node test/e2e/fixtures-server.js',
    build: 'webpack ; webpack --config webpack.min.config.js',
    dev: [
      'nps devWatch',
      'nps serveFixtures'
      ].join(' && '),
    devWatch: 'webpack --watch',
  },
}
