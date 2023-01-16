let handler = async (m, { conn, text }) => {
function no(number){
return number.replace(/\s/g,'').replace(/([@+-])/g,'')}
text = no(text)

if(isNaN(text)) {
var number = text.split`@`[1]
} else if(!isNaN(text)) {
var number = text
}

if(!text && !m.quoted) return conn.reply(m.chat, `*ETIQUETE AL USUARIO, ESCRIBA SU NUMERO O RESPONDA AL MENSAJE PARA DESBANEAR*`, m)
if(isNaN(number)) return conn.reply(m.chat, `*EL NÚMERO QIE INGRESÓ NO ES VÁLIDO PARA DESBANEAR*`, m)
try {
if(text) {
var user = number + '@s.whatsapp.net'
} else if(m.quoted.sender) {
var user = m.quoted.sender
} else if(m.mentionedJid) {
var user = number + '@s.whatsapp.net'
}} catch (e) {
} finally {
  
let groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat) : {}
let participants = m.isGroup ? groupMetadata.participants : []
let users = m.isGroup ? participants.find(u => u.jid == user) : {}
let number = user.split('@')[0]
  
global.global.db.data.users[user].banned = false
conn.reply(m.chat, `*@${number} HA SIDO DESBANEADO(A) DE LA BASE DE DATOS*`, null, { mentions: [user] })
}}

handler.tags = ['owner']
handler.command = ['desbanearuser', 'desbanearusuario', 'desbanear'] 
handler.owner = true

export default handler
