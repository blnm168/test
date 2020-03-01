import opn from 'opn'
import config from '../config.js'
import boxen from 'boxen'
import internalIp from 'internal-ip'

const url = `http://localhost:${config.get('port')}`

opn(url)

let message = `Local    =>  ${config.get('host_port')}\n`
let ipAddress = internalIp.v4.sync()
message += `Network  =>  http://${ipAddress}:${config.get('port')}\n`
message += `Proxy    =>  ${config.get('setProxy')}`
if (config.get('setProxy')) {
  message += `\nTarget   =>  ${config.get('proxyParams').target}`
}
console.log(
  boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: 'double',
    borderColor: 'green'
  })
)

process.exit()
