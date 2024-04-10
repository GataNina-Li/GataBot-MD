import cpp from "country-phone-prefix"
import { codeToEmoji } from 'emoji-country-flags'

let handler = async (m, { conn, usedPrefix, command, isOwner, isAdmin, text }) => {
let phoneNumbers, conditions
if (!(isAdmin || isOwner)) return m.reply(`*No tienes autorizado usar este comando, solo es para mí Creador(a) y Admins*`)

let txt = `
*Comando Beta*
_Este comando es para definir qué hacer si alguien específico entra al grupo o envía mensajes dentro del mismo._

> Agrega un prefijo de número de teléfono (país), número completo, etiqueta o responde al mensaje del usuario

*Elige qué deseas que pase si ingresa o está en el grupo:*
[1] Eliminar usuario inmediatamente.
[2] Eliminar todos sus nuevos mensajes.
[3] Prohibir que pueda usar el Bot.
[4] Que no pueda usar comandos +18 (aún no disponible)

⚠️ *Presta atención*
- Si agregas un prefijo (país) y una o más condiciones, el efecto aplicará para todos los que coincidan con ese prefijo.
- Estas condiciones no aplicarán si el usuario ingresado es mi Creador(a) o Admins.
- No es posible aplicar condiciones al Bot.
`.trim()
  
switch (command) {
case "newcondicion":
if (!(text || m.quoted)) return m.reply(txt)

if (text.includes('|') && !m.quoted) {
let parts = text.split('|').map(part => part.trim())
phoneNumbers = parts[0].split(',').map(num => num.trim()).join(', ')
conditions = parts[1].split(',').map(num => parseInt(num.trim()))
//} //else if (!m.quoted) { 
phoneNumbers = phoneNumbers ? phoneNumbers : text
if (phoneNumbers.includes(',')) {
function no(number) {
return number.replace(/\s/g, '').replace(/([@+-])/g, '')
}
text = no(phoneNumbers)
let numbers = []
if (text.includes(',')) {
numbers = text.split(',').map(num => num.trim())
} else {
numbers.push(text)
}
let users = numbers.filter(num => !isNaN(num)).map(num => num + '@s.whatsapp.net')
let tags = numbers.filter(num => num.includes('@'))
users = [...users, ...tags]
if (users.length === 0 && m.quoted.sender) {
users.push(m.quoted.sender)
}
user = users.join(', ')
}else{
function no(number){
return number.replace(/\s/g,'').replace(/([@+-])/g,'')}
text = no(phoneNumbers)
if(isNaN(text)) {
var number = text.split`@`[1]
} else if(!isNaN(text)) {
var number = text
}
if(text) {
var user = number + '@s.whatsapp.net'
} else if(m.quoted.sender) {
var user = m.quoted.sender
} else if(m.mentionedJid) {
var user = number + '@s.whatsapp.net'
}}
} else if (!m.quoted) {
return m.reply('Debes separar el prefijo y la condición con "|".')
}

let data = {
grupo: {
usuario: m.quoted && m.quoted.sender ? m.quoted.sender : user.split(', ').map(u => u.trim()),
condicion: conditions || (user ? user.split(',').map(numero => parseInt(numero.trim())) : text.split(',').map(numero => parseInt(numero.trim()))),
admin: m.sender
},
prefijos: []
}

let jsonData = JSON.stringify(data, null, 2)
console.log(user)
console.log(jsonData)
//global.db.data.chats[m.chat].sCondition = jsonData
break

case "newprefijo":
txt = `*Escribe uno o más prefijos de países que desees que los usuarios con dicho prefijo sean eliminados del grupo al ingresar*

> *Nota:* Separa con comas los prefijos y no es necesiro usar el símbolo *"+"* por cada prefijo agregado

*Ejemplo:* 
\`${usedPrefix + command}\` +593, 54, 7

⚠️ *Presta atención*
- Es posible que los prefijos que agregues puedan eliminar a usuarios que coincidan incluso los que ya llevan tiempo en el grupo
`.trim()
if (!text) return m.reply(txt)
  
let prefijos = text
let prefijosArray = prefijos.split(',').map(prefijo => prefijo.trim())
let encontrados = []
let noEncontrados = []
let paisesPorPrefijo = {}
let codeTxt = ''
let noCodeTxt = ''

prefijosArray.forEach(prefijo => {
prefijo = prefijo.startsWith('+') ? prefijo : `+${prefijo}`;
let encontrado = false;
for (let country in cpp) {
if (cpp[country].prefix === prefijo) {
let countryCode = cpp[country].iso2
codeTxt += `El prefijo *${prefijo}* corresponde al país \`\`\`${country}\`\`\` \`(${countryCode})\``
encontrados.push({ prefix: prefijo, country, countryCode })
if (!paisesPorPrefijo[prefijo]) {
paisesPorPrefijo[prefijo] = []
}
paisesPorPrefijo[prefijo].push({ country, countryCode })
encontrado = true
}}

if (!encontrado) {
noCodeTxt += `No se encontró ningún país con el prefijo ${prefijo}`
noEncontrados.push(prefijo)
}})

if (encontrados.length > 0) {
codeTxt += `\n\n> *Se encontró el siguiente país para cada prefijo:*`
let prefijosMostrados = new Set()
encontrados.forEach((encontrado) => {
const { prefix, country, countryCode } = encontrado
const emoji = codeToEmoji(countryCode);
if (!prefijosMostrados.has(prefix)) {
codeTxt += `*El prefijo ${prefix} corresponde al país ${country} (${countryCode}):* ${emoji}`
prefijosMostrados.add(prefix)
}})
} else {
noCodeTxt += `\n\nNo se encontraron países con los prefijos especificados`
}

for (let prefijo in paisesPorPrefijo) {
codeTxt +=`\n\n> *Países con el prefijo ${prefijo}:*`
paisesPorPrefijo[prefijo].forEach((pais) => {
const { country, countryCode } = pais
const emoji = codeToEmoji(countryCode)
noCodeTxt += `\`${country} (${countryCode}):\` ${emoji}`
})
}
if (noEncontrados.length > 0) {
noCodeTxt += `\n\nLos siguientes prefijos no coinciden con ningún país: ${noEncontrados.join(', ')}`
}
await m.reply(codeTxt)
await m.reply(noCodeTxt)
break
}}
handler.command = /^(newcondicion|newprefijo)\b$/i
handler.group = true
export default handler

//let storedData = JSON.parse(global.db.data.chats[m.chat].sCondition)
