require('babel-register')({
  presets: [['env']]
})

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./webpack/development.config').default
} else {
  module.exports = require('./webpack/production.config').default
}
