'use strict'

/* eslint no-console: 0 */

const superstatic = require('superstatic/lib/server')

const options = {
  port: process.env.PORT || 8000,
  config: {
    public: './dist',
    redirects: [
      {
        source: '/health',
        destination: '/health.html',
      },
      {
        source: '/',
        destination: '/strike.js',
      },
    ],
  },
  cwd: __dirname,
  gzip: true,
}

const app = superstatic(options)

app.listen(err => {
  if (err) {
    console.log(err)
  }

  console.log(`Static server listening on port ${options.port} ...`)
})
