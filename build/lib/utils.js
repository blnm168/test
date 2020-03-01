import packageConfig from '../../package.json'
import path from 'path'
import glob from 'glob'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import fs from 'fs'
import prettier from 'prettier'

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}

exports.getEntries = () => {
  let entries = {}
  let chunks = []
  glob.sync('src/pages/**/app.js').forEach(pathfinder => {
    const chunk = pathfinder.split('src/pages/')[1].split('/app.js')[0]
    pathfinder = path.relative('src', pathfinder)
    entries[chunk] = pathfinder
    chunks.push(chunk)
  })
  return {
    entries: entries,
    chunks: chunks
  }
}

exports.setHtmlWebpackPlugin = baseConfig => {
  const logs = []
  glob.sync('src/pages/**/app.js').forEach(pathfinder => {
    const chunk = pathfinder.split('src/pages/')[1].split('/app.js')[0]
    const htmlFile = path.join('src/pages/', chunk, 'app.html')
    const filename = chunk + '.html'
    let template = path.join(__dirname, 'index.html')

    if (fs.existsSync(htmlFile)) {
      template = path.relative('src', htmlFile)
    }
    let htmlLog = {
      name: path.basename(chunk),
      route: filename
    }
    const htmlInfoFile = path.join('src/pages/', chunk, 'page.json')
    if (fs.existsSync(htmlInfoFile)) {
      let infoJson = JSON.parse(fs.readFileSync(htmlInfoFile).toString())
      Object.assign(htmlLog, infoJson)
    }
    logs.push(htmlLog)
    const htmlConf = {
      filename: filename,
      template: template,
      inject: 'body',
      chunks: ['framework', 'vendor', 'commons', chunk],
      cache: false,
      hash: process.env.NODE_ENV !== 'development'
    }
    if (process.env.NODE_ENV === 'development') {
      htmlConf.chunks = ['commons', chunk]
    }
    baseConfig.plugins.push(new HtmlWebpackPlugin(htmlConf))
  })
  generateLogs(logs)
  return baseConfig
}

function generateLogs (logs) {
  const logsAssembly = prettier.format(
    JSON.stringify({
      routes: logs
    }),
    { parser: 'json' }
  )
  fs.unlink('../../logs/route.logs.json', function () {
    fs.writeFile('logs/route.logs.json', logsAssembly, function (err) {
      if (err) {
        return console.log(err)
      }
      // console.log("\n", "Route logs was saved!");
    })
  })

  const logsTree = logs.reduce((assemble, item) => {
    let route = item.route
    route.split('/').reduce((assemble, name) => {
      const pack = assemble[name] || {}
      let extname = path.extname(name)
      if (extname === '.html') {
        // name = path.basename(name, '.html')
        name = item.name
        assemble[name] = route
      } else {
        assemble[name] = pack
      }
      return pack
    }, assemble)
    return assemble
  }, {})
  const logsTreeAssembly = prettier.format(JSON.stringify(logsTree), {
    parser: 'json'
  })
  fs.unlink('../../logs/tree.logs.json', function () {
    fs.writeFile('logs/tree.logs.json', logsTreeAssembly, function (err) {
      if (err) {
        return console.log(err)
      }
    })
  })
}
