import fs from 'fs';
import archiver from 'archiver';

let handler = async (m, { conn, text, usedPrefix, command }) => {
const databaseFolder = './database';
const jadibtsFolder = './GataJadiBot'; 
const tarPath = './backup.tar.gz'; 
let option = parseInt(text);

if (![1, 2, 3].includes(option)) return await m.reply(`*⚠️ ¿QUÉ HAGO? UN BACKUP DE LA SESIÓN O BASE DE DATOS?*. USAR DE LA SIGUIENTE MANERA. EJEMPLO:\n${usedPrefix + command} 1 _(Enviar la session "creds.json")_\n${usedPrefix + command} 2 _(Enviar la base de datos)_\n${usedPrefix + command} 3 _(Envía la carpeta "GataJadiBot" completa)_`);

try {
let d = new Date();
let date = d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric' });

if (option === 1) {
const path = conn.user.jid !== global.conn.user.jid ? `./GataJadiBot/${conn.user.jid.split`@`[0]}/creds.json` : `./GataBotSession/creds.json`;
if (!fs.existsSync(path)) return await m.reply('⚠️ El archivo *creds.json* no existe.');

let creds = fs.readFileSync(path);
await conn.reply(m.sender, `📁 *Sesión* (${date})`, fkontak);
await conn.sendMessage(m.sender, { document: creds, mimetype: 'application/json', fileName: `creds.json` }, { quoted: m });

} else if (option === 2) {
if (!fs.existsSync(databaseFolder)) return await m.reply('⚠️ La carpeta *database* no existe.');

await m.reply(`_*🗂️ Preparando envío de base de datos...*_`)
const output = fs.createWriteStream(tarPath);
const archive = archiver('tar', { gzip: true,
gzipOptions: { level: 9 }});
output.on('close', async () => {
console.log(`Archivo .tar.gz creado: ${archive.pointer()} bytes`);
await conn.reply(m.sender, `📂 *Base de datos* (${date})`, fkontak);
await conn.sendMessage(m.sender, { document: fs.readFileSync(tarPath), mimetype: 'application/gzip', fileName: `database.tar.gz` }, { quoted: m });
fs.unlinkSync(tarPath);
});

archive.on('error', (err) => { throw err; });
archive.pipe(output);
archive.directory(databaseFolder, false);
archive.finalize();

} else if (option === 3) {
if (!fs.existsSync(jadibtsFolder)) return await m.reply('⚠️ La carpeta *GataJadiBot* no existe.');
await m.reply(`_*📂 Preparando la carpeta "GataJadiBot"...*_`);
const output = fs.createWriteStream(tarPath);
const archive = archiver('tar', { gzip: true,
gzipOptions: { level: 9 }});
output.on('close', async () => {
console.log(`Archivo .tar.gz creado: ${archive.pointer()} bytes`);
await conn.reply(m.sender, `📂 *Carpeta "GataJadiBot"* (${date})`, fkontak);
await conn.sendMessage(m.sender, { document: fs.readFileSync(tarPath), mimetype: 'application/gzip', fileName: `GataJadiBot.tar.gz` }, { quoted: m });
fs.unlinkSync(tarPath);
});

archive.on('error', (err) => { throw err; });
archive.pipe(output);
archive.directory(jadibtsFolder, false);
archive.finalize();
}} catch (e) {
await m.reply(lenguajeGB['smsMalError3']() + '\n*' + lenguajeGB.smsMensError1() + '*\n*' + usedPrefix + `${lenguajeGB.lenguaje() == 'es' ? 'reporte' : 'report'}` + '* ' + `${lenguajeGB.smsMensError2()} ` + usedPrefix + command);
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`);
console.log(e)
}
};
handler.help = ['backup'];
handler.tags = ['owner'];
handler.command = /^(backup|respaldo|copia)$/i;
handler.owner = true;

export default handler;

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
