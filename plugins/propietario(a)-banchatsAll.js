let handler = async (m, { conn }) => {
try {
// Leer la base de datos
await db.read();
//Buscar y actualizar todos los isBanned: false
const chats = db.data.chats;
let users = global.db.data.users
let successfulBans = 0;
for (const [key, value] of Object.entries(chats)) {
if (value.isBanned === false) {
value.isBanned = true
users.banned = true
//console.log('Baneando chat:', key);
successfulBans++;
}}
//Escribir los cambios en la base de datos
await db.write();
if (successfulBans === 0) {
try {
} catch (error) {
let resp = `${error} 𝙉𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘽𝘼𝙉𝙀𝘼𝙍 𝙉𝙄𝙉𝙂𝙐́𝙉 𝘾𝙃𝘼𝙏`.trim()
let int = '';
let count = 0;
console.log (error, '𝙉𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘽𝘼𝙉𝙀𝘼𝙍 𝙉𝙄𝙉𝙂𝙐́𝙉 𝘾𝙃𝘼𝙏`)
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 50));
int += c;
count++;
if (count % 10 === 0) {
conn.sendPresenceUpdate('composing' , m.chat)}}
await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} ) 
throw new Error('𝙉𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘽𝘼𝙉𝙀𝘼𝙍 𝙉𝙄𝙉𝙂𝙐́𝙉 𝘾𝙃𝘼𝙏`, error);
}} else {
let resp = `𝙎𝙀 𝘽𝘼𝙉𝙀𝘼𝙍𝙊𝙉 : ${successfulBans} 𝘾𝙃𝘼𝙏𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀`.trim()
let int = '';
let count = 0;
console.log(`𝙎𝙀 𝘽𝘼𝙉𝙀𝘼𝙍𝙊𝙉 : ${successfulBans} 𝘾𝙃𝘼𝙏𝙎 𝘾𝙊𝙍𝙍𝘼𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀`);
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 50));
int += c;
count++;
if (count % 10 === 0) {
}}
await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
}} catch (e) {
let resp = `𝙀𝙍𝙍𝙊𝙍: ${e.message}`.trim()
let int = '';
let count = 0;
console.log(`𝙀𝙍𝙍𝙊𝙍: ${e.message}`);
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 50));
int += c;
count++;
if (count % 10 === 0) {
}}
await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000})} 
await waitTwoMinutes()         
try {
await db.read();
const chats = db.data.chats;
let users = global.db.data.users
let successfulUnbans = 0;
for (const [key, value] of Object.entries(chats)) {
if (value.isBanned === true) {
value.isBanned = false
users.banned = false
//console.log('Desbaneando chat:', key);
successfulUnbans++;
}}
//Escribir los cambios en la base de datos
await db.write();
if (successfulUnbans === 0) {
try {
} catch (error) {
let resp = `𝙉𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘽𝘼𝙉𝙀𝘼𝙍 𝙉𝙄𝙉𝙂𝙐́𝙉 𝘾𝙃𝘼𝙏`.trim()
let int = '';
let count = 0;
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 50));
int += c;
count++;
if (count % 10 === 0) {
}}
await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
throw new Error('𝙉𝙊 𝙎𝙀 𝙋𝙐𝙀𝘿𝙀 𝘽𝘼𝙉𝙀𝘼𝙍 𝙉𝙄𝙉𝙂𝙐́𝙉 𝘾𝙃𝘼𝙏`, error);
}} else {
let resp = `𝙎𝙀 𝘿𝙀𝙎𝘽𝘼𝙉𝙀𝘼𝙍𝙊𝙉 : ${successfulUnbans} 𝘾𝙃𝘼𝙏𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀`.trim()
let int = '';
let count = 0;
console.log(`𝙎𝙀 𝘿𝙀𝙎𝘽𝘼𝙉𝙀𝘼𝙍𝙊𝙉 : ${successfulUnbans} 𝘾𝙃𝘼𝙏𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝘼𝙈𝙀𝙉𝙏𝙀`);
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 50));
int += c;
count++;
if (count % 10 === 0) {
}}
await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
}} catch (e) {
let resp = `𝙀𝙍𝙍𝙊𝙍 : ${e.message}`.trim()
let int = '';
let count = 0;
console.log(`𝙀𝙍𝙍𝙊𝙍 : ${e.message}`);
for (const c of resp) {
await new Promise(resolve => setTimeout(resolve, 50));
int += c;
count++;
if (count % 10 === 0) {
}}
await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )}};
handler.help = ['desbaneachat']
handler.tags = ['owner']
handler.command = /^desbaneachat$/i
handler.owner = true
export default handler
  
function waitTwoMinutes() {
return new Promise(resolve => {setTimeout(() => {resolve();
}, 2 * 60 * 1000); 
})}