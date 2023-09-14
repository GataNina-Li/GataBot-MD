export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
if (m.isBaileys && m.fromMe) return !0
if (m.isGroup) return !1
if (!m.message) return !0
if (m.text.includes('PIEDRA') || m.text.includes('PAPEL') || m.text.includes('TIJERA') || m.text.includes('estado') || m.text.includes('verificar') || m.text.includes('creadora') || m.text.includes('bottemporal') || m.text.includes('grupos') || m.text.includes('instalarbot') || m.text.includes('términos') || m.text.includes('bots') || m.text.includes('deletebot') || m.text.includes('eliminarsesion') || m.text.includes('serbot') || m.text.includes('verify') || m.text.includes('register') || m.text.includes('registrar') || m.text.includes('reg') || m.text.includes('reg1') || m.text.includes('nombre') || m.text.includes('name') || m.text.includes('nombre2') || m.text.includes('name2') || m.text.includes('edad') || m.text.includes('age') || m.text.includes('edad2') || m.text.includes('age2') || m.text.includes('genero') || m.text.includes('género') || m.text.includes('gender') || m.text.includes('identidad') || m.text.includes('pasatiempo') || m.text.includes('hobby') || m.text.includes('identify') || m.text.includes('finalizar') || m.text.includes('pas2') || m.text.includes('pas3') || m.text.includes('pas4') || m.text.includes('pas5') || m.text.includes('registroC') || m.text.includes('deletesesion') || m.text.includes('registroR') || m.text.includes('jadibot')) return !0

let chat = global.db.data.chats[m.chat]
let user = global.db.data.users[m.sender]
let bot = global.db.data.settings[this.user.jid] || {}

if (bot.antiPrivate && !isOwner && !isROwner) {
if (user.counterPrivate === 0) {
await m.reply(`*@${m.sender.split`@`[0]} ESTÁ PROHIBIDO ESCRIBIR AL PRIVADO.*\n\n⚠️ \`\`\`PRIMERA ADVERTENCIA\`\`\` ⚠️`)
  
} else if (user.counterPrivate === 1) {
let grupos = [ nn, nnn, nnnt, nnntt, nnnttt ].getRandom()
await m.reply(`*@${m.sender.split`@`[0]} YA SE MENCIONÓ QUE NO PUEDE ESCRIBIR AL PRIVADO.*\n\n*PUEDE UNIRSE A ESTE GRUPO OFICIAL*\n${grupos}\n\n‼️ *SI VUELVE A ESCRIBIR SERÁ BLOQUEADO(A)* ‼️\n⚠️ \`\`\`SEGUNDA ADVERTENCIA\`\`\` ⚠️`)
  
} else if (user.counterPrivate === 2) {
await m.reply(`*@${m.sender.split`@`[0]} SERÁ BLOQUEADO(A). SE MENCIONÓ ANTES QUE NO PODÍA ESCRIBIR AL PRIVADO.*\n\n⚠️ \`\`\`TERCERA ADVERTENCIA\`\`\` ⚠️`)
await this.updateBlockStatus(m.sender, 'block')
user.counterPrivate = 0  
}
user.counterPrivate++
}
return !1
}

