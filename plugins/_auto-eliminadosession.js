/* Codigo hecho por @Fabri115 y mejorado por BrunoSobrino */
//🟢 También mejorado por: https://github.com/elrebelde21 🤣
//🟢 ELIMINAR AUTOMÁTICAMENTE LAS SESSIONES NO IMPORTARTE (ESTOS ES PRUEBA) 
import { readdirSync, unlinkSync, existsSync, promises as fs, rmSync } from 'fs';
import path from 'path';

const  handler = m => m
handler.all = async function (m) {
if (/^$/i.test(m.text) ) {
if (global.conn.user.jid !== conn.user.jid) {
}}
await delay(1000) // 600000 = 10 minutos
const sessionPath = './GataBotSession/';
try {
if (!existsSync(sessionPath)) {
}
const files = await fs.readdir(sessionPath);
let filesDeleted = 0;
for (const file of files) {
if (file !== 'creds.json') {
await fs.unlink(path.join(sessionPath, file));
filesDeleted++;
}}
if (filesDeleted === 0) {
console.log("NO HAY NADA POR ELIMINAR")
} else {
console.log(`╭» 🟢 GataBotSession 🟢\n│☁ SE ELIMINADO ${filesDeleted} ARCHIVOS DE SESSION CON ÉXITO\n╰―――――――――――――――――――✤`)
}
} catch (err) {
console.error('Error al leer la carpeta o los archivos de sesión:', err);
}};
//handler.command = /^()/i;
export default handler;
const delay = time => new Promise(res => setTimeout(res, time))
