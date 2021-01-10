import appRoot from 'app-root-path'
import ejs from 'ejs'
import express from 'express'
import fs from 'fs'
import config from 'config'

const FIXTURES_PATH = `${appRoot}/test/e2e/fixtures/pages`

module.exports = {
  start: function startServer() {
    // Serving page fixtures
    this.app = express()
    this.app.set('views', FIXTURES_PATH)
    this.app.engine('html', ejs.renderFile)
    this.app.use('/dist', express.static(`${appRoot}/src/client/dist`))
    this.app.use('/favicon.ico', (req, res) => {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' })
      res.end()
    })
    this.app.get('/', (req, res) => res.redirect('/index.html'))
    this.app.use('/*', (req, res, next) => {
      const template = FIXTURES_PATH + req.baseUrl

      fs.stat(template, (err, stats) => {
        if (err) {
          console.log(err)
        }
        if (stats && stats.isFile()) {
          res.render(template, { settings: config.get('fixtures') })
        }
        next()
      })
    })

    this.server = this.app.listen(config.get('fixtures.port'))
  },

  stop: function stopServer(cb) {
    return new Promise((resolve, reject) => {
      this.server.close(err => {
        if (err) {
          if (cb) {
            return cb(err)
          }
          return reject(err)
        }
        if (cb) {
          return cb()
        }
        return resolve()
      })
    })
  },
}

if (require.main === module) {
  module.exports.start()
  console.log(`Server is available at http://localhost:${config.get('fixtures.port')}`)
}
