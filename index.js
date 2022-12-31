console.log('𝙄𝙉𝙄𝘾𝙄𝘼𝙉𝘿𝙊 : 𝙎𝙏𝘼𝙍𝙏𝙄𝙉𝙂 🚀')
import { join, dirname } from 'path'
import { createRequire } from "module";
import { fileURLToPath } from 'url'
import { setupMaster, fork } from 'cluster'
import { watchFile, unwatchFile } from 'fs'
import cfonts from 'cfonts';
import { createInterface } from 'readline'
import yargs from 'yargs'
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname) 
const { name, author } = require(join(__dirname, './package.json')) 
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

say('Gata\nBot\nMD', {
font: 'chrome',
align: 'center',
gradient: ['red', 'magenta']})
say(`Por Gata Dios | DIEGO-OFC`, {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']})

var isRunning = false
/**
* Start a js file
* @param {String} file `path/to/file`
*/
function start(file) {
if (isRunning) return
isRunning = true
let args = [join(__dirname, file), ...process.argv.slice(2)]

say('✅ 𝙔𝘼 𝙋𝙐𝙀𝘿𝙀 𝙀𝙎𝘾𝘼𝙉𝙀𝘼𝙍 𝙀𝙇 𝘾𝙊𝘿𝙄𝙂𝙊 𝙌𝙍\n𝙔𝙊𝙐 𝘾𝘼𝙉 𝙉𝙊𝙒 𝙎𝘾𝘼𝙉 𝙏𝙃𝙀 𝙌𝙍 𝘾𝙊𝘿𝙀', {
font: 'console',
align: 'center',
gradient: ['red', 'magenta']})
  
setupMaster({
exec: args[0],
args: args.slice(1), })
let p = fork()
p.on('message', data => {
//setTimeout(() => {  
console.log('┆ ✓ ACTIVIDAD ACTUALIZADA\n╰----------------- - - -', data)//}, 50000)
switch (data) {
case 'reset':
p.process.kill()
isRunning = false
start.apply(this, arguments)
break
case 'uptime':
p.send(process.uptime())
break }})
p.on('exit', (_, code) => {
isRunning = false
console.error('⚠️ Error Inesperado : Unexpected Error', code)
  
p.process.kill()
isRunning = false
start.apply(this, arguments)
  
if (code === 0) return
watchFile(args[0], () => {
unwatchFile(args[0])
start(file)})})
let opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
if (!opts['test'])
if (!rl.listenerCount()) rl.on('line', line => {
p.emit('message', line.trim())})}
start('main.js') 
