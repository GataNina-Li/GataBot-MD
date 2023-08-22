import fetch from 'node-fetch'
const scp1 = require('./lib/scraper') 
let handler = async (m, { conn, command, args }) => {
let full = /f$/i.test(command)
if (!text) return conn.reply(m.chat, '*Porfavor ingresa un url de la página a la que se le tomará captura 🔎*', m)
let krt = await scp1.ssweb(text)
//let url = /https?:\/\//.test(args[0]) ? args[0] : 'https://' + args[0]
//let ss = await (await fetch(global.API('nrtm', '/api/ssweb', { delay: 1000, url, full }))).buffer()
conn.sendFile(m.chat, krt.result, 'error.png', m)
}
handler.help = ['ss', 'ssf'].map(v => v + ' <url>')
handler.tags = ['internet']
handler.command = /^ss(web)?f?$/i
handler.money = 40
export default handler
