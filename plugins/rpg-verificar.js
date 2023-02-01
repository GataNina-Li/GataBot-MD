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
if (text[0] == usedPrefix) return conn.sendButton(m.chat, '*FALTA SU NOMBRE, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + 'GataDios', '*Acaso quiere usar su nombre registrado en su WhatsApp ?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2' + ' ' + usedPrefix + nombreWA]], m)
if (text.length >= 15) return conn.sendButton(m.chat, '*USE UN NOMBRE MÁS CORTO, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + 'GataDios', '*Acaso quiere usar su nombre registrado en su WhatsApp ?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2' + ' ' + usedPrefix + nombreWA]], m) 
if (verificar.test(text) == false || text.length <= 1) return conn.sendButton(m.chat, '*PERSONALICE SU NOMBRE PARA REGISTRAR, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + 'GataDios', '*También puede vincular su nombre de WhatsApp*\n_Usando el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2' + ' ' + usedPrefix + nombreWA]], m)
user.name = text.slice(1).trim()
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO SU LO SIGUIENTE:*\n*NOMBRE:* ' + user.name, wm, null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
}
	
if (command == 'nombre2' || command == 'name2') {
if (verificar.test(nombreWA) == false) return conn.sendButton(m.chat, 'REGISTRE SU NOMBRE COMO ESTE EJEMPLO\n' + usedPrefix + 'nombre2 ' + usedPrefix + nombreWA, 'Quiere personalizar su nombre?\nUse el Botónde abajo en ese caso', null, [[`USAR CON WA`, usedPrefix + `verificar `]], m)
user.name = nombreWA.slice(1).trim()
if (verificar.test(nombreWA) == true) return conn.sendButton(m.chat, 'GENIAL SE HA REGISTRADO COMO:\n' + user.name, wm, null, [[`REGISTRAR MI EDAD`, usedPrefix + `edad`]], m)

}

	
if (command == 'edad' || command == 'age') {
const sections = [
{ title: "SELECCIONA TU EDAD!",
rows: [ {title: "Edad Random", 
rowId: usedPrefix + command + ' ' + usedPrefix + pickRandom(['30','29','28','27','26','25','24','23','22','21','20','19','18','17','16','15','14','13','12','11','10','31'])}]
}, {
title: "JOVEN",
rows: [
{title: "10 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '10'},
{title: "11 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '11'},
{title: "12 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '12'},
{title: "13 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '13'},
{title: "14 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '14'},
{title: "15 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '15'},
{title: "16 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '16'},
{title: "17 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '17'}]
}, {
title: "ADULTO",
rows: [
{title: "18 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '18'},
{title: "19 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '19'},
{title: "20 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '20'},
{title: "21 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '21'},
{title: "22 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '22'},
{title: "23 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '23'},
{title: "24 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '24'},
{title: "25 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '25'},
{title: "26 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '26'},
{title: "27 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '27'},
{title: "28 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '28'},
{title: "29 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '29'},
{title: "30 Años", rowId: usedPrefix + command + ' ' + usedPrefix + '30'}]
}, {
title: "NO ESTÁ TÚ EDAD ?",
rows: [
{title: "Personalizar mí edad", rowId: usedPrefix + 'edad2'}]},]

const listMessage = {
  text: `SELECCIONE SU EDAD POR FAVOR\nNOMBRE: ${user.name}\n╰━━━━━━━━━━━━━━━━━━⬣`,
  footer: wm,
  title: "╭━━━[ *𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊* ]━━━━⬣\n",
  buttonText: "Pulsa Aqui!",
  sections
}

await conn.sendMessage(m.chat, listMessage, m)
if (verificar.test(text) == true) return conn.sendButton(m.chat, 'GENIAL HA REGISTRADO SU EDAD COMO: ' + user.age + ' años', wm, null, [[`REGISTRAR MI GÉNERO `, usedPrefix + `genero`]], m)
user.age = text.slice(1).trim()	 
}
	
if (command == 'edad2' || command == 'age2') {
if (text.slice(1).trim() > usedPrefix + usedPrefix + '50'.slice(1).trim()) throw 'Que viejo (。-`ω´-)'
if (text.slice(1).trim() < usedPrefix + usedPrefix + '10'.slice(1).trim()) throw '🚼  Basado, los bebes no saber escribir.✍️😳'
if (verificar.test(text) == false || !text) return conn.sendButton(m.chat, 'REGISTRE SU EDAD COMO ESTE EJEMPLO\n' + usedPrefix + 'edad2 ' + usedPrefix + '35', wm, null, [[`USAR CON WA`, usedPrefix + `nombre2 ` + usedPrefix + nombreWA]], m)
if (verificar.test(text) == true) return conn.sendButton(m.chat, 'GENIAL SE HA REGISTRADO COMO: ' + user.age + ' años', wm, null, [[`REGISTRAR MI GÉNERO `, usedPrefix + `genero`]], m)
user.age = text.slice(1).trim()
}

	
if (command == 'genero' || command == 'género' || command == 'gender') {
const sections = [
{ title: "🚹 MASCULINO",
title: "🚹 MASCULINO",
rows: [ 
{title: "🚹 Hombre", rowId: usedPrefix + command + ' ' + usedPrefix + text }]
}, {
title: "🚺 FEMENINO",
rows: [
{title: "🚺 Mujer", rowId: usedPrefix + command + ' ' + usedPrefix + text }]
}, {
title: "👤 OCULTAR",
rows: [
{title: "👤 Ocultado", rowId: usedPrefix + command + ' ' + usedPrefix + text }]},]

const listMessage = {
  text: `SELECCIONE SU SEXO BIOLÓGICO POR FAVOR\nNOMBRE: ${user.name}\nEDAD:${user.age}\n╰━━━━━━━━━━━━━━━━━━⬣`,
  footer: wm,
  title: "╭━━━[ *𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊* ]━━━━⬣\n",
  buttonText: "Pulsa Aqui!",
  sections
}

await conn.sendMessage(m.chat, listMessage, m)
if (verificar.test(text) == true) return conn.sendButton(m.chat, 'GENIAL HA REGISTRADO SU SEXO BIOLÓGICO COMO: ' + user.genero + ' años', wm, null, [[`MENU`, usedPrefix + `menu`]], m)
user.genero = text.slice(1).trim()	 
}
 
  /*if (!name) throw '🐈 El nombre no puede esta vacio'
  if (!age) throw '🐈 La edad no puede esta vacia (Numeros)'
  age = parseInt(age)
  if (age > 100) throw 'Que viejo (。-`ω´-)'
  if (age < 5) throw '🚼  Basado, los bebes saber escribir.✍️😳'
  if (name.length >= 30) throw '🐈 Fua que basado, el nombre es muy largo que quiere un puente como nombre😹' 
  user.name = name.trim()
  user.age = age*/
	
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
await conn.sendButton(m.chat, caption, `𝙏𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀 𝙏𝙀 𝙎𝙀𝙍𝙑𝙄𝙍𝘼 𝙀𝙉 𝘾𝘼𝙎𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝘼 𝘽𝙊𝙍𝙍𝘼𝙍 𝙎𝙐 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n${usedPrefix}unreg numero de serie\n${wm}`, [['𝘼𝙝𝙤𝙧𝙖 𝙚𝙨𝙩𝙤𝙮 𝙑𝙚𝙧𝙞𝙛𝙞𝙘𝙖𝙙𝙤(𝙖)!! ✅', '/profile']], m)
await m.reply(`${sn}`) 
}
handler.help = ['daftar', 'register'].map(v => v + ' <nama>.<umur>')
handler.tags = ['xp']

handler.command = ['verify', 'verificar', 'register', 'reg', 'nombre2', 'name2', 'edad', 'age', 'edad2', 'age2', 'genero', 'género', 'gender']  ///^(verify|verificar|reg(ister)?)$/i

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
