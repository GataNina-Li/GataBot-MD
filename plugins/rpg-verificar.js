//CÓDIGO CREADO POR GataNina-Li : https://github.com/GataNina-Li

import { createHash } from 'crypto'
let nombre, edad, genero, identidad, pasatiempo, registro, _registro

let handler = async function (m, { conn, text, command, usedPrefix }) {
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? m.sender : m.sender

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]}
let nombreWA = await usedPrefix + conn.getName(m.sender) //'@' + m.sender.split("@s.whatsapp.net")[0] 
let user = global.db.data.users[m.sender]
let verificar = new RegExp(usedPrefix)

if (user.registered === true) throw `${iig}𝙔𝘼 𝙀𝙎𝙏𝘼𝙎 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊(𝘼)!!\n𝙎𝙄 𝙌𝙐𝙄𝙀𝙍𝙀 𝘼𝙉𝙐𝙇𝘼𝙍 𝙎𝙐 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝙊 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n*${usedPrefix}unreg numero de serie*\n\n𝙎𝙄 𝙉𝙊 𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝘼 𝙎𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊\n*${usedPrefix}myns*`

if (command == 'verificar' || command == 'verify' || command == 'register' || command == 'reg') {
await conn.sendButton(m.chat, iig + '😇 *CÓMO DESEA REGISTRARSE?*', '*REGISTRO RAPIDO*\n- Insignia de verificación\n- Desbloquear comandos que requieran registro\n\n*REGISTRO COMPLETO*\n- Insignia de verificación\n- Desbloquear comandos que requieran registro\n- Recompensas por usar este tipo de registro\n- Premium Temporal Gratis\n\n' + wm, null, [[`📑 REGISTRO RÁPIDO`, usedPrefix + 'Reg1'], [`🗂️ REGISTRO COMPLETO`, usedPrefix + 'nombre']], m) 
}
	
if (command == 'reg1') {
registro = text.replace(/\s+/g, usedPrefix) 
_registro = text.split(" ",2) 

if (!text) return conn.sendButton(m.chat, mg + `*PARÁMETROS DEL REGISTRO:*\n\`\`\`${usedPrefix + command} nombre edad\`\`\`\n\n*EJEMPLO:* \`\`\`${usedPrefix + command} ${gt} 20\`\`\``, '```CONSEJO:```\n\n- Escriba "Nombre" + "espacio" + "edad"\n- Su nombre no debe de contener números\n- La edad no debe de contener Letras\n\n*Sabías que puede personalizar más su registro?*\n_Usando el Botón de abajo_', null, [[`🗂️ USAR REGISTRO COMPLETO`, usedPrefix + 'nombre']], m)
if (_registro['length'] >= 3 || isNaN(_registro[1])) return conn.sendButton(m.chat, fg + '🙃 *ESTÁ INTENTANDO SEPRAR SU NOMBRE O UNIR TODO?* ', '🧐 *COINCIDE COMO EN ESTOS EJEMPLOS:*\n' + `\`\`\`${usedPrefix + command} Super${gt}20\`\`\`` + '\n' + `\`\`\`${usedPrefix + command} Super 15 ${gt} \`\`\`` + '\n' + `\`\`\`${usedPrefix + command} Super ${gt} 24 De ${author}\`\`\`\n\n` + '*Si cumple que tenga (Nombre/Frase y Edad) Autocompletaremos su Registro*\n_Use el Botón de abajo_', null, [[`🌟 AUTOCOMPLETAR MI REGISTRO`, usedPrefix + 'reg1' + ' ' + text.replace(/\s+/g, '').replace(/[0-9]+/gi, "") + ' ' + text.replace(/\s+/g, '').replace(/[a-z]+/gi, "")], ['📑 VOLVER A REGISTRAR', command + usedPrefix]], m)
if (!_registro[0]) return conn.sendButton(m.chat, fg + `*FALTA SU NOMBRE, PARÁMETROS DEL REGISTRO:*\n\`\`\`${usedPrefix + command} nombre edad\`\`\``, wm, null, [[`🗂️ USAR REGISTRO COMPLETO`, usedPrefix + 'nombre']], m)
if (_registro[0].length >= 30) throw fg + '*SU NOMBRE ES MUY LARGO, USE OTRO NOMBRE POR FAVOR*' 
if (_registro[0].length <= 2) throw fg + '*SU NOMBRE ES MUY CORTO, USE OTRO NOMBRE POR FAVOR*'
_registro[0] = text.replace(/\s+/g, '').replace(/[0-9]+/gi, "")
nombre = _registro[0]
	
if (!_registro[1]) return conn.sendButton(m.chat, fg + `*FALTA SU EDAD, PARÁMETROS DEL REGISTRO:*\n\`\`\`${usedPrefix + command} nombre edad\`\`\``, wm, null, [[`🗂️ USAR REGISTRO COMPLETO`, usedPrefix + 'nombre']], m)
//if (isNaN(_registro[1])) throw '*LA EDAD DEBE DE SER SOLO NÚMEROS*'
if (_registro[1] > 50) throw fg + `*SU EDAD ES MUY MAYOR, USE OTRA EDAD POR FAVOR*\n\n*PARÁMETROS DEL REGISTRO:*\n\`\`\`${usedPrefix + command} nombre edad\`\`\``
if (_registro[1] < 10) throw fg + `*SU EDAD ES MUY MENOR, USE OTRA EDAD POR FAVOR*\n\n*PARÁMETROS DEL REGISTRO:*\n\`\`\`${usedPrefix + command} nombre edad\`\`\``
edad = parseInt(_registro[1]) //_registro[1]	
global.db.data.users[m.sender]['registroR'] = true
	
await conn.sendButton(m.chat, eg + '*GENIAL!! SE HA COMPLETADO LO SIGUIENTE*\n*- - - - - - - - - - - - - - - - - - - - - - - - - - - -*\n\n*✤ NOMBRE:* ' + nombre + '\n' + '*✤ EDAD:* ' + edad + ' años', wm, null, [[`🐈 FINALIZAR REGISTRO`, usedPrefix + 'finalizar']], m)	
}
		
if (command == 'nombre' || command == 'name') {
if (verificar.test(text) == false || text.length <= 1) return conn.sendButton(m.chat, '*PERSONALICE SU NOMBRE PARA REGISTRAR, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + gt + '```', '*También puede vincular su nombre de WhatsApp*\n_Usando el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, `${usedPrefix + 'nombre2'}`]], m)
if (text.length >= 25) return conn.sendButton(m.chat, '*USE UN NOMBRE MÁS CORTO, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + gt + '```', '*Acaso quiere usar su nombre registrado en su WhatsApp ?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2']], m)
if (text.length <= 2) return conn.sendButton(m.chat, '*NOMBRE FALTANTE O MUY CORTO, EJEMPLO:*\n' + '```' + usedPrefix + command + ' ' + gt + '```', '*Acaso quiere usar su nombre registrado en su WhatsApp ?*\n_En ese caso use el Botón de abajo_', null, [[`🛐 REGISTRAR CON WHATSAPP`, usedPrefix + 'nombre2']], m) 

nombre = text.replace(/\s+/g, '').replace(/[0-9]+/gi, "").trim()
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + nombre, wm, null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
}
	
if (command == 'nombre2' || command == 'name2') {
if (nombreWA.slice(1).length < 2) return conn.sendButton(m.chat, '*SU NOMBRE DE WHATSAPP ES MUY CORTO PARA REGISTRAR USANDO* ' + '```' + usedPrefix + command + '```', '*Modifique su nombre de WhatsApp e intente de nuevo o puede personalizar su nombre*\n_Sí quiere personalizar use el Botón de abajo_', null, [[`🛐 PERSONALIZAR REGISTRO`, usedPrefix + 'nombre']], m) 
if (nombreWA.slice(1).length > 25) return conn.sendButton(m.chat, '*SU NOMBRE DE WHATSAPP ES MUY LARGO PARA REGISTRAR USANDO* ' + '```' + usedPrefix + command + '```', '*Modifique su nombre de WhatsApp e intente de nuevo o puede personalizar su nombre*\n_Sí quiere personalizar use el Botón de abajo_', null, [[`🛐 PERSONALIZAR REGISTRO`, usedPrefix + 'nombre']], m)
nombre = nombreWA.replace(/\s+/g, '').replace(/[0-9]+/gi, "").slice(1).trim()	
	
if (verificar.test(text) == false) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + nombre, wm, null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
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
text: `*SELECCIONE SU EDAD POR FAVOR*\n\n*NOMBRE:* _${nombre}_\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*`,
footer: wm,
title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*\n",
buttonText: "🫵 SELECCIONAR EDAD 🫵 ",
sections
}

if (!text) return conn.sendMessage(m.chat, listMessage, m)
if (isNaN(text)) throw '*INGRESE SOLO NÚMEROS*'
if (text.slice(1).trim() > 50) throw '*DEMASIADO MAYOR PARA SER REGISTRADO*'
if (text.slice(1).trim() < 10) throw '*DEMASIADO MENOR PARA SER REGISTRADO*' //.replace(/[^0-9.]+/gi,' ')
	
//user.age = text.slice(1) 
edad = text.slice(1).trim()
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + nombre + '\n' + '*EDAD:* ' + edad + ' años', wm, null, [[`🍃 REGISTRAR MI GÉNERO `, usedPrefix + `genero`]], m)
}
	
if (command == 'edad2' || command == 'age2') {
if (verificar.test(text.slice(1)) == false && !text) return conn.sendButton(m.chat, '*PERSONALICE SU EDAD PARA REGISTRAR, EJEMPLO:*\n' + usedPrefix + command + ' ' + usedPrefix + '35', '*Sabías que puede seleccionar su edad de una lista ?*\n_En ese caso use el Botón de abajo_', null, [[`🔢 REGISTRAR MI EDAD`, usedPrefix + 'edad']], m)
if (isNaN(text)) throw '*INGRESE SOLO NÚMEROS*'
if (text > 50) throw '*DEMASIADO MAYOR PARA SER REGISTRADO*'
if (text < 10) throw '*DEMASIADO MENOR PARA SER REGISTRADO*'

//user.age = text.slice(1) 
edad = text.replace(/\s+/g, '').replace(/[a-z]+/gi, "").trim()
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + nombre + '\n' + '*EDAD:* ' + edad + ' años', wm, null, [[`REGISTRAR MI GÉNERO `, usedPrefix + `genero`]], m)
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
text: `*SELECCIONE SU GÉNERO POR FAVOR*\n\n*NOMBRE:* _${nombre}_\n*EDAD:* _${edad}_\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*`,
footer: wm,
title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*\n",
buttonText: "🧬 SELECCIONAR GÉNERO 🧬 ",
sections
}

if (!text) return conn.sendMessage(m.chat, listMessage, m)
global.db.data.users[m.sender]['registroC'] = true
genero = text.slice(1).trim()	
	
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + nombre + '\n' + '*EDAD:* ' + edad + ' años' + '\n' + '*GENERO:* ' + genero, wm, null, [[`🌱 REGISTRAR MI IDENTIDAD`, usedPrefix + 'identidad']], m)	 
}
	
if (command == 'identidad' || command == 'identity') {
const sections = [
{ title: "🌱 SELECCIONE SU IDENTIDAD DE GÉNERO!!",
rows: [
{title: "• Agénero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Agénero' },	
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Agénero'},		
{title: "• Andrógino", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Andrógino' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Andrógino'},	
{title: "• Andrógina", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Andrógina' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Andrógina'},	
{title: "• Asexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Asexual' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Asexual'},		
{title: "• Bigénero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Bigénero' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Bigénero'},	
{title: "• Bisexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Bisexual' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Bisexual'},	
{title: "• Cisgenero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Cisgenero' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Cisgenero'},	
{title: "• CrossDresser", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'CrossDresser' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'CrossDresser'},	
{title: "• Demigénero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Demigénero' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Demigénero'},	
{title: "• Gay", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Gay' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Gay'},	
{title: "• Género fluido", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Género fluido' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Género fluido'},	
{title: "• Género neutro", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Género neutro' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Género neutro'},	
{title: "• Genderqueer", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Genderqueer' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Genderqueer'},	
{title: "• Heterosexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Heterosexual' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Heterosexual'},	
{title: "• Heteroflexible", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Heteroflexible' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Heteroflexible'},	
{title: "• Homoflexible", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Homoflexible' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Homoflexible'},	
{title: "• Homosexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Homosexual' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Homosexual'},	
{title: "• Intersexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Intersexual' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Intersexual'},	
{title: "• Lesbiana", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Lesbiana' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Lesbiana'},	
{title: "• Pansexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Pangénero' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Pangénero'},	
{title: "• Pangénero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Pangénero' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Pangénero'},	
{title: "• Questioning", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Questioning' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Questioning'},	
{title: "• Queer", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Queer' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Queer'},	
{title: "• Sapiosexual", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Sapiosexual' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Sapiosexual'},	
{title: "• Transgénero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Transgénero' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Transgénero'},	
{title: "• Trigénero", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Trigénero' },	
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Trigénero'},	
{title: "• Variante/Género expansivo", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Género expansivo' },
{title: "⬆️ Quiero Saber mas ⬆️", rowId: usedPrefix + 'google' + ' ' + 'Género expansivo'}]
}, {
title: comienzo + " 👤 OCULTAR " + fin,
rows: [
{title: "Ocultado", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Ocultado' }]},]

const listMessage = {
text: `*SELECCIONE SU IDENTIDAD DE GÉNERO POR FAVOR*\n\n*NOMBRE:* _${nombre}_\n*EDAD:* _${edad}_\n*GÉNERO:* _${genero}_\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*`,
footer: wm,
title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*\n",
buttonText: "🌱 IDENTIDAD DE GÉNERO 🌱",
sections
}

if (!text) return conn.sendMessage(m.chat, listMessage, m)
	
identidad = text.slice(1).trim()
if (verificar.test(text) == true) return conn.sendButton(m.chat, '*GENIAL!! SE HA REGISTRADO LO SIGUIENTE:*\n*NOMBRE:* ' + nombre + '\n' + '*EDAD:* ' + edad + ' años' + '\n' + '*IDENTIDAD DE GÉNERO:* ' + identidad, wm, null, [[`❇️ REGISTRAR MIS PASATIEMPOS`, usedPrefix + 'pasatiempo']], m)
}
	
/*if (command == 'pasatiempo' || command == 'hobby') {
var pasatiempo1, pasatiempo2, pasatiempo3, pasatiempo4, pasatiempo5 = ''

const sections = [
{ title: "❇️ SELECCIONE HASTA 5 PASATIEMPOS!!",
rows: [
{title: "• Estudiar", rowId: usedPrefix + command + ' ' + text + 'Estudiar' },		
{title: "• Leer", rowId: usedPrefix + command + ' ' + text + 'Leer' },	
{title: "• Jugar", rowId: usedPrefix + command + ' ' + text + 'Jugar' },	
{title: "• Sedentario", rowId: usedPrefix + command + ' ' + text + 'Sdentario' },	
{title: "• Amante de los animales", rowId: usedPrefix + command + ' ' + text + 'Amante de los animales' }]
}, {
title: comienzo + " 👤 OCULTAR " + fin,
rows: [
{title: "Ocultado", rowId: usedPrefix + command + ' ' + usedPrefix + text + 'Ocultado' }]},]

const listMessage = {
text: `*SELECCIONE SUS PASATIEMPOS POR FAVOR*\n\n*NOMBRE:* _${nombre}_\n*EDAD:* _${edad}_\n*GÉNERO:* _${genero}_\n*IDENTIDAD DE GÉNERO:* _${identidad}_\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*`,
footer: wm,
title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹*\n",
buttonText: "❇️ IDENTIDAD DE GÉNERO ❇️",
sections
}

if (!text) return conn.sendMessage(m.chat, listMessage, m)
	
let uno = pasatiempo1 = text.trim()
if (pasatiempo1 == uno && pasatiempo2 == '' && pasatiempo3 == '' && pasatiempo4 == '' && pasatiempo5 == '') return
pasatiempo = uno
conn.sendButton(m.chat, '*GENIAL!! SE HA AGREGADO UN PASATIEMPO:*\n*PASATIEMPO(S):* ' + uno , 'Puede agregar hasta 5 pasatiempos consecutivos, o puede avanzar con el registro teniendo mínimo un pasatiempo\n\n' + wm, null, [[`❇️ AGREGAR OTRO PASATIEMPO`, usedPrefix + 'pasatiempo'], [`🐈 FINALIZAR REGISTRO`, usedPrefix + 'finalizar']], m)

let dos = pasatiempo2 = text.trim()
//let dos = pasatiempo + ', ' += pasatiempo2 = text.trim()
let _dos = uno + ', ' + dos
if (pasatiempo1 == uno && pasatiempo2 == _dos && pasatiempo3 == '' && pasatiempo4 == '' && pasatiempo5 == '') return
pasatiempo = _dos
conn.sendButton(m.chat, '*GENIAL!! SE HA AGREGADO OTRO PASATIEMPO:*\n*PASATIEMPO(S):* ' + _dos , 'Puede agregar hasta 5 pasatiempos consecutivos, o puede avanzar con el registro teniendo mínimo un pasatiempo\n\n' + wm, null, [[`❇️ AGREGAR OTRO PASATIEMPO`, usedPrefix + 'pasatiempo'], [`🐈 FINALIZAR REGISTRO`, usedPrefix + 'finalizar']], m)

let tres = pasatiempo3 = text.trim()
//let tres = dos + ', ' += pasatiempo3 = text.trim()
let _tres = _dos + ', ' + tres
if (pasatiempo1 == uno && pasatiempo2 == _dos && pasatiempo3 == _tres && pasatiempo4 == '' && pasatiempo5 == '') return
pasatiempo = tres
conn.sendButton(m.chat, '*GENIAL!! SE HA AGREGADO OTRO PASATIEMPO:*\n*PASATIEMPO(S):* ' + _tres , 'Puede agregar hasta 5 pasatiempos consecutivos, o puede avanzar con el registro teniendo mínimo un pasatiempo\n\n' + wm, null, [[`❇️ AGREGAR OTRO PASATIEMPO`, usedPrefix + 'pasatiempo'], [`🐈 FINALIZAR REGISTRO`, usedPrefix + 'finalizar']], m)

let cuatro = pasatiempo4 = text.trim()
//let cuatro = tres + ', ' += pasatiempo4 = text.trim()
let _cuatro = _tres + ', ' + cuatro
if (pasatiempo1 == uno && pasatiempo2 == _dos && pasatiempo3 == _tres && pasatiempo4 == _cuatro && pasatiempo5 == '') return
pasatiempo = cuatro
conn.sendButton(m.chat, '*GENIAL!! SE HA AGREGADO OTRO PASATIEMPO:*\n*PASATIEMPO(S):* ' + _cuatro , 'Puede agregar hasta 5 pasatiempos consecutivos, o puede avanzar con el registro teniendo mínimo un pasatiempo\n\n' + wm, null, [[`❇️ AGREGAR OTRO PASATIEMPO`, usedPrefix + 'pasatiempo'], [`🐈 FINALIZAR REGISTRO`, usedPrefix + 'finalizar']], m)

let cinco = pasatiempo5 = text.trim()
//let cinco = cuatro + ', ' += pasatiempo5 = text.trim()
let _cinco = _cuatro + ', ' + cinco
if (pasatiempo1 == uno && pasatiempo2 == _dos && pasatiempo3 == _tres && pasatiempo4 == _cuatro && pasatiempo5 == _cinco) return
pasatiempo = cinco
conn.sendButton(m.chat, '*GENIAL!! SE HA AGREGADO OTRO PASATIEMPO:*\n*PASATIEMPO(S):* ' + _cinco , 'Puede agregar hasta 5 pasatiempos consecutivos, o puede avanzar con el registro teniendo mínimo un pasatiempo\n\n' + wm, null, [[`🐈 FINALIZAR REGISTRO`, usedPrefix + 'finalizar']], m)
}*/
	
if (command == 'finalizar' || command == 'end') {
if (global.db.data.users[m.sender]['registroC'] == true) {
user.name = nombre 
user.age = edad
user.genero = genero
user.identidad = identidad
user.pasatiempo = pasatiempo
global.db.data.users[m.sender].money += 400
global.db.data.users[m.sender].limit += 7
global.db.data.users[m.sender].exp += 250
global.db.data.users[m.sender].joincount += 3	
}else{
user.name = nombre 
user.age = edad	
}
user.regTime = + new Date
user.registered = true
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)
	
let caption = `
🍃 \`\`\`VERIFICACIÓN EXITOSA\`\`\` 🍃
*- - - - - - - - - - - - - - - - - - - - - - - - - - - -*

😼 *REGISTRADO POR*
❱❱ ${wm}

📑 *TIPO DE REGISTRO* 
❱❱ ${user.registroC === true ? 'Registro Completo' : 'Registro Rápido'}

✅ *INSIGNIA DE VERIFICACIÓN*
❱❱   *${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}*

👤 *NOMBRE* 
❱❱ ${user.name}${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}

🔢 *EDAD* 
❱❱ ${user.age} Años *||* ${user.age > 18 ? '(Persona Adulta)' : '(Persona Joven)'}
${user.registroC === true ? `\n☘️ *GENERO*
❱❱ ${user.genero == 'Ocultado' ? `${user.genero} 🗣️` : user.genero == 'Mujer' ? `${user.genero} 🚺` : user.genero == 'Hombre' ? `${user.genero} 🚹` : ''}

🌱 *IDENTIDAD DE GÉNERO*
❱❱ ${user.identidad}

❇️ *PASATIEMPO(S)*
❱❱ ${user.pasatiempo}` : ''}

🛅 *CÓDIGO DE REGISTRO*
❱❱ ${sn}

${user.registroC === true ? 'completo' : 'Rapido'}
`.trim()

await m.reply('🍄 ```VERIFICANDO DATOS...```')
await conn.sendButton(m.chat, caption, user.registroC === true ? wm : 'Si elimina su registro se eliminara los datos e insignia y dejara de tener acceso a los comandos con registro\n\nPuede volver a eliminar su registro y registrarse desde 0 sin problema.\n\nSu código de serie le permitirá borrar su registro ejemplo:\n' + `${usedPrefix}unreg ${sn}`, [['𝘼𝙝𝙤𝙧𝙖 𝙚𝙨𝙩𝙤𝙮 𝙑𝙚𝙧𝙞𝙛𝙞𝙘𝙖𝙙𝙤(𝙖)!! ✅', '/profile']], m)
await m.reply(`${sn}`)
	
}}
handler.command = ['verify', 'verificar', 'register', 'reg', 'reg1', 'nombre', 'name', 'nombre2', 'name2', 'edad', 'age', 'edad2', 'age2', 'genero', 'género', 'gender', 'identidad', 'pasatiempo', 'hobby', 'identity', 'finalizar']  ///^(verify|verificar|reg(ister)?)$/i
export default handler
	
/*if (command == '1finalizar' || command == '1end') {
//user.registroR = false
global.db.data.users[m.sender]['registroC'] = true
user.name = nombre 
user.age = edad
user.genero = genero
global.db.data.users[m.sender].money += 400
global.db.data.users[m.sender].limit += 7
global.db.data.users[m.sender].exp += 250
global.db.data.users[m.sender].joincount += 3
user.regTime = + new Date
user.registered = true
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)
	
let caption1 = `╭━━━[ *𝙑𝙀𝙍𝙄𝙁𝙄𝘾𝘼𝙍 | 𝙑𝙀𝙍𝙄𝙁𝙔* ]━━━━⬣
┃ *TIPO DE REGISTRO* 
┃ ${user.registroC === true ? 'REGISTRO COMPLETO' : 'REGISTRO RAPIDO'}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *NOMBRE* 
┃ ${user.name} ${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *EDAD* 
┃ ${user.age} Años 
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *GÉNERO BIOLÓGICO* 
┃ ${user.genero}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ *BONO* 
┃ *$250 XP*
┃ *$400 GATACOINS*
┃ *$7 DIAMANTES*
╰━━━━━━━━━━━━━━━━━━⬣
${user.registroC === true ? 'completo' : 'Rapido'}`.trim()

await m.reply('🍄 ```VERIFICANDO DATOS...```')
await conn.sendButton(m.chat, caption1, user.registroC === true ? wm : 'Si elimina su registro se eliminara los datos e insignia y dejara de tener acceso a los comandos con registro\n\nPuede volver a eliminar su registro y registrarse desde 0 sin problema.\n\nSu código de serie le permitirá borrar su registro ejemplo:\n' + `${usedPrefix}unreg ${sn}`, [['𝘼𝙝𝙤𝙧𝙖 𝙚𝙨𝙩𝙤𝙮 𝙑𝙚𝙧𝙞𝙛𝙞𝙘𝙖𝙙𝙤(𝙖)!! ✅', '/profile']], m)
await m.reply(`${sn}`)
}

	
if (command == '2finalizar' || command == '2end') {
global.db.data.users[m.sender]['registroR'] = true
//user.registroC = false
user.name = nombre 
user.age = edad 
user.regTime = + new Date
user.registered = true
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)

let caption2 = `
🍃 \`\`\`VERIFICACIÓN EXITOSA\`\`\` 🍃
*- - - - - - - - - - - - - - - - - - - - - - - - - - - -*

😼 *REGISTRADO POR*
❱❱ ${wm}

📑 *TIPO DE REGISTRO* 
❱❱ ${user.registroC === true ? 'Registro Completo' : 'Registro Rápido'}

✅ *INSIGNIA DE VERIFICACIÓN*
❱❱   *${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}*

👤 *NOMBRE* 
❱❱ ${user.name}${user.registered === true ? 'ͧͧͧͦꙶͣͤ✓ᚲᴳᴮ' : ''}

🔢 *EDAD* 
❱❱ ${user.age} Años *||* ${user.age > 18 ? '(Persona Adulta)' : '(Persona Joven)'}

🛅 *CÓDIGO DE REGISTRO*
❱❱ ${sn}

${user.registroC === true ? 'completo' : 'Rapido'}
`.trim()

await m.reply('🍄 ```VERIFICANDO DATOS...```')
await conn.sendButton(m.chat, caption2, user.registroC === true ? wm : 'Si elimina su registro se eliminara los datos e insignia y dejara de tener acceso a los comandos con registro\n\nPuede volver a eliminar su registro y registrarse desde 0 sin problema.\n\nSu código de serie le permitirá borrar su registro ejemplo:\n' + `${usedPrefix}unreg ${sn}`, [['𝘼𝙝𝙤𝙧𝙖 𝙚𝙨𝙩𝙤𝙮 𝙑𝙚𝙧𝙞𝙛𝙞𝙘𝙖𝙙𝙤(𝙖)!! ✅', '/profile']], m)
await m.reply(`${sn}`)
}*/
	
	
	


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
