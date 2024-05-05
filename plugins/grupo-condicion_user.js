/*import country_prefix from "country-phone-prefix"
import { codeToEmoji } from 'emoji-country-flags'

let handler = async (m, { conn, usedPrefix, command, isOwner, isAdmin, text }) => {
const jsonString = JSON.stringify(global.db.data.chats[m.chat].sCondition)
const parsedData = JSON.parse(jsonString)
  
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

// Verificar si global.db.data.chats[m.chat].sCondition tiene datos
if (!global.db.data.chats[m.chat].sCondition) {
// Si no tiene datos, crear la estructura predeterminada
let data = {
grupo: {
usuario: m.quoted && m.quoted.sender ? m.quoted.sender : user.split(', ').map(u => u.trim()),
condicion: conditions || (user ? user.split(',').map(numero => parseInt(numero.trim())) : text.split(',').map(numero => parseInt(numero.trim()))),
admin: m.sender
},
prefijos: []
}
let jsonData = JSON.stringify(data, null, 2);
global.db.data.chats[m.chat].sCondition = jsonData
} else {
let jsonData = JSON.parse(global.db.data.chats[m.chat].sCondition);
let grupoData = {
grupo: {
usuario: m.quoted && m.quoted.sender ? m.quoted.sender : user.split(', ').map(u => u.trim()),
condicion: conditions || (user ? user.split(',').map(numero => parseInt(numero.trim())) : text.split(',').map(numero => parseInt(numero.trim()))),
admin: m.sender
}
jsonData.grupo.usuario.push(grupoData.grupo.usuario)
jsonData.grupo.condicion.push(grupoData.grupo.condicion)
jsonData.grupo.admin = grupoData.grupo.admin
let updatedJsonData = JSON.stringify(jsonData, null, 2)
global.db.data.chats[m.chat].sCondition = updatedJsonData
console.log(updatedJsonData)
}
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
let prefijosValidos = []
let encontrados = []
let noEncontrados = []
let duplicados = []
let paisesPorPrefijo = {}
let contadorPrefijos = {}
let codeTxt = ''
let noCodeTxt = ''
let prefijo2 = ''

prefijosArray.forEach(prefijo => {
prefijo = prefijo.trim()
prefijosValidos.push(parseInt(prefijo))
prefijo = prefijo.startsWith('+') ? prefijo : `+${prefijo}`
let encontrado = false

prefijo2 = prefijo.startsWith('+') ? prefijo.slice(1) : prefijo
if (contadorPrefijos[prefijo2]) {
duplicados.push(prefijo2)
} else {
contadorPrefijos[prefijo2] = 1
}
    
for (let country in country_prefix) {
if (country_prefix[country].prefix === prefijo) {
let countryCode = country_prefix[country].iso2
encontrados.push({ prefix: prefijo, country, countryCode })
if (!paisesPorPrefijo[prefijo]) {
paisesPorPrefijo[prefijo] = []
}
paisesPorPrefijo[prefijo].push({ country, countryCode })
encontrado = true
}}
if (!encontrado) {
noEncontrados.push(prefijo)
}
})

if (encontrados.length > 0) {
codeTxt += `> *Se encontró el siguiente país para cada prefijo:*\n`
let prefijosMostrados = new Set()
encontrados.forEach((encontrado) => {
const { prefix, country, countryCode } = encontrado
const emoji = codeToEmoji(countryCode);
if (!prefijosMostrados.has(prefix)) {
codeTxt += `- *El prefijo \`${prefix}\` corresponde al país ${country} (${countryCode}):* ${emoji}\n`
prefijosMostrados.add(prefix)
}
})
}

for (let prefijo in paisesPorPrefijo) {
codeTxt += `\n> *Coincide con el prefijo ${prefijo}:*\n`
paisesPorPrefijo[prefijo].forEach((pais) => {
const { country, countryCode } = pais
const emoji = codeToEmoji(countryCode)
codeTxt += `- \`${country} (${countryCode}):\` ${emoji}\n`
})
}

if (noEncontrados.length > 0) {
noCodeTxt += `*No se encontró uno o más países con algún prefijo especificado*\n\n> Soluciona primero el prefijo que no coincide, recuerda que solo se acepta prefijos de país, *no de ciudad, estado o similar*.\n\n*Prefijos que no coinciden con ningún país:* \`${noEncontrados.join(', ')}\``
}

if (duplicados.length > 0) {
let mensaje = `*Los siguientes prefijos están duplicados:* ${duplicados.map(prefijo => ` \`+${prefijo}\``)}\n\n > *Solo agregué un prefijo*, no es necesario agregar el mismo prefijo varias veces.`
return m.reply(mensaje)
}
    
if (noEncontrados.length > 0) {
await m.reply(noCodeTxt.trim())
} else {
await m.reply(codeTxt.trim())

//if (prefijosValidos.length > 0 && prefijosValidos.some(prefijo => global.db.data.chats[m.chat].sCondition.prefijos.includes(prefijo))) {
try {

//if (Array.isArray(parsedData) && parsedData.length > 0 && parsedData[0].prefijos) {
if (prefijosValidos.length > 0 && prefijosValidos.some(prefijo => parsedData[0].prefijos.includes(prefijo))) {
const prefijosConSigno = parsedData[0].prefijos.map(prefijo => `\`+${prefijo}\``).join(', ')
duplicados = prefijosValidos.filter(prefijo =>  parsedData[0].prefijos.includes(prefijo))
const prefijosDuplicados = duplicados.map(prefijo => `\`+${prefijo}\``).join(', ');
m.reply(`Alguno de los prefijos que intentas agregar ya existe. Aquí tienes los prefijos actuales agregados: ${prefijosConSigno}\n\n*Prefijo(s) duplicado(s):* ${prefijosDuplicados}`)
} else {
if (parsedData[0].prefijos.length === 0) {
global.db.data.chats[m.chat].sCondition.prefijos = prefijosValidos
} else {
global.db.data.chats[m.chat].sCondition.prefijos.push(...prefijosValidos)
}}
} catch (error) {
console.log('Error:', error);
}

}
break
    
}}
handler.command = /^(newcondicion|newprefijo)\b$/i
handler.group = true
export default handler

//let storedData = JSON.parse(global.db.data.chats[m.chat].sCondition)
*/
