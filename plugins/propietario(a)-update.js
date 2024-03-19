import { execSync } from 'child_process';

const handler = async (m, { conn, text }) => {
try {
const stdout = execSync('git pull' + (m.fromMe && text ? ' ' + text : ''));
let messager = stdout.toString()
if (messager.includes('Already up to date.')) messager = `${lenguajeGB.smsAvisoIIG()} 𝙔𝙖 𝙚𝙨𝙩𝙖 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙙𝙤 𝙖 𝙡𝙖 𝙫𝙚𝙧𝙨𝙞𝙤́𝙣 𝙧𝙚𝙘𝙞𝙚𝙣𝙩𝙚.*`
if (messager.includes('Updating')) messager = `${lenguajeGB.smsAvisoEG()} 𝙎𝙚 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙤 𝙘𝙤𝙧𝙧𝙚𝙘𝙩𝙖𝙢𝙚𝙣𝙩𝙚.*\n\n` + stdout.toString()
conn.reply(m.chat, messager, m);
} catch {      
try {    
const status = execSync('git status --porcelain');
if (status.length > 0) {
const conflictedFiles = status
.toString()
.split('\n')
.filter(line => line.trim() !== '')
.map(line => {
if (line.includes('.npm/') || line.includes('.cache/') || line.includes('tmp/') || line.includes('GataBotSession/') || line.includes('npm-debug.log')) {
return null;
}
return '*→ ' + line.slice(3) + '*'})
.filter(Boolean);
if (conflictedFiles.length > 0) {
const errorMessage = `${lenguajeGB.smsAvisoFG()} 𝙎𝙚 𝙝𝙖𝙣 𝙝𝙚𝙘𝙝𝙤 𝙘𝙖𝙢𝙗𝙞𝙤𝙨 𝙡𝙤𝙘𝙖𝙡𝙚𝙨 𝙚𝙣 𝙖𝙧𝙘𝙝𝙞𝙫𝙤𝙨 𝙙𝙚𝙡 𝙗𝙤𝙩 𝙦𝙪𝙚 𝙚𝙣𝙩𝙧𝙖𝙣 𝙚𝙣 𝙘𝙤𝙣𝙛𝙡𝙞𝙘𝙩𝙤 𝙘𝙤𝙣 𝙡𝙖𝙨 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙘𝙞𝙤𝙣𝙚𝙨 𝙙𝙚𝙡 𝙧𝙚𝙥𝙤𝙨𝙞𝙩𝙤𝙧𝙞𝙤. 𝙋𝙖𝙧𝙖 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙧, 𝙧𝙚𝙞𝙣𝙨𝙩𝙖𝙡𝙖 𝙚𝙡 𝙗𝙤𝙩 𝙤 𝙧𝙚𝙖𝙡𝙞𝙯𝙖 𝙡𝙖𝙨 𝙖𝙘𝙩𝙪𝙖𝙡𝙞𝙯𝙖𝙘𝙞𝙤𝙣𝙚𝙨 𝙢𝙖𝙣𝙪𝙖𝙡𝙢𝙚𝙣𝙩𝙚.*\n\n*𝘼𝙧𝙘𝙝𝙞𝙫𝙤𝙨 𝙚𝙣 𝙘𝙤𝙣𝙛𝙡𝙞𝙘𝙩𝙤:*\n\n${conflictedFiles.join('\n')}.*`
await conn.reply(m.chat, errorMessage, m);  
}}
} catch (error) {
console.error(error);
if (error.message) {
errorMessage2 += `\n${fg}` + error.message;
}
await m.reply(`${fg}`) 
}}};
handler.command = /^(update|actualizar|gitpull)$/i;
handler.rowner = true;
export default handler;
