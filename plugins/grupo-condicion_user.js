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

⚠️ Presta atención
- Si agregas un prefijo (país) y una o más condiciones, el efecto aplicará para todos los que coincidan con ese prefijo.
- Estas condiciones no aplicarán si el usuario ingresado es mi Creador(a) o Admins.
- No es posible aplicar condiciones al Bot.
`
if (!(text || m.quoted)) return m.reply(txt)

if (text.includes('|') && !m.quoted) {
let parts = text.split('|').map(part => part.trim())
phoneNumbers = parts[0].split(',').map(num => num.trim()).join(', ')
conditions = parts[1].split(',').map(num => parseInt(num.trim()))
} else if (m.quoted) { 
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
}
}
} else return m.reply('Debes separar el prefijo y la condición con "|".')

let data = {
usuario: user.split(', ').map(u => u.trim()), 
condicion: conditions,
autor: m.sender
}
let jsonData = JSON.stringify(data, null, 2)
console.log(user)
console.log(jsonData)
//global.db.data.chats[m.chat].sCondition = jsonData

}
handler.command = /^(newcondicion)$/i
handler.group = true
export default handler

//let storedData = JSON.parse(global.db.data.chats[m.chat].sCondition)
