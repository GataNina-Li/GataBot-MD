import { createHash } from 'crypto'
let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}
let nombreWA = conn.getName(m.sender)
let user = global.db.data.users[m.sender]
let verificar = new RegExp(usedPrefix)

if (user.registered === true) throw `${iig}𝙔𝘼 𝙀𝙎𝙏𝘼𝙎 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊(𝘼)!!\n𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀 𝘼𝙉𝙐𝙇𝘼𝙍 𝙎𝙐 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n*${usedPrefix}unreg numero de serie*\n\n𝙎𝙄 𝙉𝙊 𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝘼 𝙎𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n*${usedPrefix}myns*`
//if (!Reg.test(text)) return conn.sendMessage(m.chat, listMessage, m)
//let [_, nombre, edad] = text.match(/usedPrefix/)
  
if (command == 'verificar' || command == 'verify') {
if (text.length >= 25) return conn.sendButton(m.chat, '*USE UN NOMBRE MÁS CORTO, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + usedPrefix + 'GataDios' + '```', '*Acaso quiere usar su nombre registrado en su WhatsApp ?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2']], m)
if (text.length <= 4) return conn.sendButton(m.chat, '*NOMBRE FALTANTE O MUY CORTO, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + usedPrefix + 'GataDios' + '```', '*Acaso quiere usar su nombre registrado en su WhatsApp ?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2']], m) 
if (verificar.test(text) == false || text.length <= 1) return conn.sendButton(m.chat, '*PERSONALICE SU NOMBRE PARA REGISTRAR, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + 'GataDios', '*También puede vincular su nombre de WhatsApp*\n_Usando el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2']], m)
user.name = text.slice(1).trim()
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + user.name, wm, null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
}
	
if (command == 'nombre2' || command == 'name2') {
if (nombreWA.slice(1).trim() >= 25) return conn.sendButton(m.chat, '*USE UN NOMBRE MÁS CORTO, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + usedPrefix + 'GataDios' + '```', '*Sabías que puede personalizar su nombre?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 PERSONALIZAR REGISTRO`, usedPrefix + 'verificar']], m)
if (nombreWA.slice(1).trim() <= 4) return conn.sendButton(m.chat, '*NOMBRE FALTANTE O MUY CORTO, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + usedPrefix + 'GataDios' + '```', '*Sabías que puede personalizar su nombre?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 PERSONALIZAR REGISTRO`, usedPrefix + 'verificar']], m) 
user.name = nombreWA.slice(1).trim()
if (verificar.test(text) == false) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + user.name, wm, null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
}

	
if (command == 'edad' || command == 'age') {
const sections = [
{ title: "🌟 SELECCIONA TU EDAD!!",
rows: [ {title: "♻️ Edad Random", rowId: usedPrefix + command + ' ' + usedPrefix +  text + pickRandom(['30','29','28','27','26','25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','31'])}]
}, {
title: "🍃 JOVEN",
rows: [
{title: "1️⃣0️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '10'},
{title: "1️⃣1️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '11'},
{title: "1️⃣2️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '12'},
{title: "1️⃣3️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '13'},
{title: "1️⃣4️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '14'},
{title: "1️⃣5️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '15'},
{title: "1️⃣6️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '16'},
{title: "1️⃣7️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '17'}]
}, {
title: "🌳 ADULTO",
rows: [
{title: "1️⃣8️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '18'},
{title: "1️⃣9️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '19'},
{title: "2️⃣0️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '20'},
{title: "2️⃣1️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '21'},
{title: "2️⃣2️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '22'},
{title: "2️⃣3️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '23'},
{title: "2️⃣4️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '24'},
{title: "2️⃣5️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '25'},
{title: "2️⃣6️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '26'},
{title: "2️⃣7️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '27'},
{title: "2️⃣8️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '28'},
{title: "2️⃣9️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '29'},
{title: "3️⃣0️⃣ Años", rowId: usedPrefix + command + ' ' + usedPrefix + text + '30'}]
}, {
title: "🤔 NO ESTÁ TÚ EDAD ?",
rows: [
{title: "🔢 Personalizar mí edad", rowId: usedPrefix + 'edad2'}]},]

const listMessage = {
  text: `*SELECCIONE SU EDAD POR FAVOR*\n\n*NOMBRE:* _${user.name}_\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*`,
  footer: wm,
  title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*\n",
  buttonText: "🫵 SELECCIONAR EDAD 🫵 ",
  sections
}

if (!text) return conn.sendMessage(m.chat, listMessage, m)
if (verificar.test(text) == false || !text.slice(1) ) return conn.sendButton(m.chat, '*PERSONALICE SU EDAD PARA REGISTRAR, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + '35', '*Sabías que puede seleccionar su edad de una lista ?*\n_En ese caso use el Botón de abajo_', null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
if (isNaN(text.slice(1))) throw '*INGRESE SOLO NÚMEROS*'
if (text.slice(1) > 50) throw '*DEMASIADO MAYOR PARA SER REGISTRADO*'
if (text.slice(1) < 10 || text.slice(1) < 0) throw '*DEMASIADO MENOR PARA SER REGISTRADO*'
	
user.age = text.slice(1)
global._age = ''
text.slice(1) = _age
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + user.name + '\n' + '*EDAD:* ' + user.age + ' años', wm, null, [[`🍃 REGISTRAR MI GÉNERO `, usedPrefix + `genero`]], m)
}
	
if (command == 'edad2' || command == 'age2') {
if (verificar.test(text) == false || !text.slice(1) ) return conn.sendButton(m.chat, '*PERSONALICE SU EDAD PARA REGISTRAR, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + '35', '*Sabías que puede seleccionar su edad de una lista ?*\n_En ese caso use el Botón de abajo_', null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
if (isNaN(text.slice(1))) throw '*INGRESE SOLO NÚMEROS*'
if (text.slice(1) > 50) throw '*DEMASIADO MAYOR PARA SER REGISTRADO*'
if (text.slice(1) < 10 || text.slice(1) < 0) throw '*DEMASIADO MENOR PARA SER REGISTRADO*'

user.age = text.slice(1)
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + user.name + '\n' + '*EDAD:* ' + user.age + ' años', wm, null, [[`REGISTRAR MI GÉNERO `, usedPrefix + `genero`]], m)
}

	
if (command == 'genero' || command == 'género' || command == 'gender') {
const sections = [
{ title: "🌟 SELECCIONA TU GÉNERO!!",
title: comienzo + " 🚹 MASCULINO " + fin,
rows: [ 
{title: "🚹 Hombre", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Hombre' }]
}, {
title: comienzo + " 🚺 FEMENINO " + fin,
rows: [
{title: "🚺 Mujer", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Mujer' }]
}, {
title: comienzo + " 👤 OCULTAR " + fin,
rows: [
{title: "👤 Ocultado", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Ocultado' }]},]

const listMessage = {
  text: `*SELECCIONE SU GÉNERO POR FAVOR*\n\n*NOMBRE:* _${user.name}_\n*EDAD:* _${user.age}_\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*`,
  footer: wm,
  title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*\n",
  buttonText: "🧬 SELECCIONAR GÉNERO 🧬 ",
  sections
}

if (!text) return conn.sendMessage(m.chat, listMessage, m)
	
user.genero = text.slice(1).trim()	 
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + user.name + '\n' + '*EDAD:* ' + user.age + ' años' + '\n' + '*GENERO:* ' + user.genero, wm, null, [[`🐈 FINALIZAR REGISTRO`, usedPrefix + `finalizar`]], m)	 
}

if (command == 'finalizar' || command == 'end') {
user.age = _age
user.regTime = + new Date
user.registered = true
let sn = createHash('md5').update(m.sender).digest('hex')
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender
global.db.data.users[m.sender].money += 400
global.db.data.users[m.sender].limit += 7
global.db.data.users[m.sender].exp += 250
global.db.data.users[m.sender].joincount += 3
  let caption = `
╭━━━[ *𝙑𝙀𝙍𝙄𝙁𝙄𝘾𝘼𝙍 | 𝙑𝙀𝙍𝙄𝙁𝙔* ]━━━━⬣
┃ *NOMBRE* 
┃ ${user.name} ${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *EDAD* 
┃ ${user.age} Años
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *GÉNERO BIOLÓGICO * 
┃ ${user.genero}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *BONO* 
┃ *$250 XP*
┃ *$400 GATACOINS*
┃ *$7 DIAMANTES*
╰━━━━━━━━━━━━━━━━━━⬣`
//let author = global.author
await m.reply('```REGISTRANDO DATOS...```')   
await conn.sendButton(m.chat, caption, `𝙏𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀 𝙏𝙀 𝙎𝙀𝙍𝙑𝙄𝙍𝘼 𝙀𝙉 𝘾𝘼𝙎𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝘼 𝘽𝙊𝙍𝙍𝘼𝙍 𝙎𝙐 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n${usedPrefix}unreg numero de serie\n${wm}`, [['𝘼𝙝𝙤𝙧𝙖 𝙚𝙨𝙩𝙤𝙮 𝙑𝙚𝙧𝙞𝙛𝙞𝙘𝙖𝙙𝙤(𝙖)!! ✅', '/profile']], m)
await m.reply(`${sn}`) 
}}
handler.help = ['daftar', 'register'].map(v => v + ' <nama>.<umur>')
handler.tags = ['xp']
handler.command = ['verify', 'verificar', 'register', 'reg', 'nombre2', 'name2', 'edad', 'age', 'edad2', 'age2', 'genero', 'género', 'gender', 'finalizar', 'end']  ///^(verify|verificar|reg(ister)?)$/i

export default handler

/*
import { createHash } from 'crypto'
let handler = async function (m, { conn, text, usedPrefix }) {
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let user = global.db.data.users[m.sender]
if (user.registered === true) throw `${iig}𝙔𝘼 𝙀𝙎𝙏𝘼𝙎 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊(𝘼)!!\n𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀 𝘼𝙉𝙐𝙇𝘼𝙍 𝙎𝙐 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n*${usedPrefix}unreg numero de serie*\n\n𝙎𝙄 𝙉𝙊 𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝘼 𝙎𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n*${usedPrefix}myns*`
let name = conn.getName(m.sender)
let age = `${pickRandom(['10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40'])}`
age = parseInt(age)
user.name = name.trim()
user.age = age
user.regTime = + new Date
user.registered = true
let sn = createHash('md5').update(m.sender).digest('hex')
//global.db.data.users[m.sender].money += 1000
//global.db.data.users[m.sender].limit += 15
//global.db.data.users[m.sender].exp += 1500
//global.db.data.users[m.sender].joincount += 5
let caption = `╭━━━[ *𝙑𝙀𝙍𝙄𝙁𝙄𝘾𝘼𝙍 | 𝙑𝙀𝙍𝙄𝙁𝙔* ]━━━━⬣
┃ *NOMBRE* 
┃ ${name} ${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *EDAD* 
┃ *${age} años*
╰━━━━━━━━━━━━━━━━━━⬣`
//let author = global.author
await conn.sendButton(m.chat, caption, `𝙏𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀 𝙏𝙀 𝙎𝙀𝙍𝙑𝙄𝙍𝘼 𝙀𝙉 𝘾𝘼𝙎𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝘼 𝘽𝙊𝙍𝙍𝘼𝙍 𝙎𝙐 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n${usedPrefix}unreg numero de serie\n${wm}`, [['𝘼𝙝𝙤𝙧𝙖 𝙚𝙨𝙩𝙤𝙮 𝙑𝙚𝙧𝙞𝙛𝙞𝙘𝙖𝙙𝙤(𝙖)!! ✅', '/profile']], m)
await m.reply(`${sn}`) 

}
handler.help = ['verificar']
handler.tags = ['xp']
handler.command = /^(verify|register|verificar|registrar|verificado|verificada|verificarme)$/i
export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}
*/
