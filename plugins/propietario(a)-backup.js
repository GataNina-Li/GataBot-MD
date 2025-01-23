import fs from 'fs'
import archiver from 'archiver'

let handler = async (m, { conn, text, usedPrefix, command }) => {
const databaseFolder = './database'
const zipPath = './database_backup.zip'
  
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

if (!fs.existsSync(databaseFolder)) {
await m.reply('⚠️ La carpeta *.database* no existe.')
return
}

if (conn.user.jid != global.conn.user.jid) {
if (!fs.existsSync(`./GataJadiBot/${conn.user.jid.split`@`[0]}/creds.json`)) {
await m.reply('⚠️ El archivo *creds.json* del Sub Bot no existe.')
return
}
} else if (!fs.existsSync('./GataBotSession/creds.json')) {
await m.reply('⚠️ El archivo *creds.json* no existe.')
return
}

await m.reply(`_*🗂️ Preparando envío de base de datos...*_`)

try {
let d = new Date()
let date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
const path = conn.user.jid != global.conn.user.jid ? `./GataJadiBot/${conn.user.jid.split`@`[0]}/creds.json` : `./GataBotSession/creds.json`
let creds = await fs.readFileSync(path)

const output = fs.createWriteStream(zipPath)
const archive = archiver('zip', { zlib: { level: 9 } })

output.on('close', async () => {
console.log(`Archivo .zip creado: ${archive.pointer()} bytes`)

await conn.reply(m.sender, `*🗓️ Database:* ${date}`, fkontak)
await conn.sendMessage(m.sender, { document: creds, mimetype: 'application/json', fileName: `creds.json`}, { quoted: m })
await conn.sendMessage(m.sender, { document: fs.readFileSync(zipPath), mimetype: 'application/zip', fileName: `.database.zip` }, { quoted: m })

fs.unlinkSync(zipPath)
})

archive.on('error', (err) => {
throw err
})

archive.pipe(output);
archive.directory(databaseFolder, false)
archive.finalize()
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command);
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
console.log(e)
}}

handler.command = /^(backup|respaldo|copia)$/i
handler.owner = true

export default handler

/*import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
await m.reply(`_*🗂️ Enviando base de datos. . .*_`)
try {
let d = new Date
let date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' })
let database = await fs.readFileSync(`./database.json`)
let creds = await fs.readFileSync(`./GataBotSession/creds.json`)
await conn.reply(m.sender, `*🗓️ Database:* ${date}`, fkontak)
await conn.sendMessage(m.sender, {document: database, mimetype: 'application/json', fileName: `database.json`}, { quoted: m })
await conn.sendMessage(m.sender, {document: creds, mimetype: 'application/json', fileName: `creds.json`}, { quoted: m })
} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command)
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}

handler.command = /^(backup|respaldo|copia)$/i
handler.owner = true

export default handler*/
