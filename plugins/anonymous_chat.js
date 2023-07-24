async function handler(m, { usedPrefix, command }) {
command = command.toLowerCase()
this.anonymous = this.anonymous ? this.anonymous : {}
switch (command) {
case 'next':
case 'leave': {
let room = Object.values(this.anonymous).find(room => room.check(m.sender))
if (!room) return this.sendMessage(m.chat, { text: `${lenguajeGB['smsChatAn1']()}\n${lenguajeGB['smsChatAn2']()}`}, { quoted: m })
//this.sendButton(m.chat, `${lenguajeGB['smsChatAn1']()}`, lenguajeGB.smsChatAn2() + wm, null, [[lenguajeGB.smsChatAn3(), `.start`]], m)
m.reply(`${lenguajeGB['smsChatAn4']()}`)
let other = room.other(m.sender) 
if (other) await this.sendMessage(other, { text: `${lenguajeGB['smsChatAn5']()}`}, { quoted: m })
//this.sendButton(other, `${lenguajeGB['smsChatAn5']()}`, lenguajeGB.smsChatAn6() + wm, null, [[lenguajeGB.smsChatAn3(), `.start`]], m)
delete this.anonymous[room.id]
if (command === 'leave') break
}
case 'start': {
if (Object.values(this.anonymous).find(room => room.check(m.sender))) return this.sendMessage(m.chat, { text: `${lenguajeGB['smsChatAn7']()}`}, { quoted: m })
//this.sendButton(m.chat, `${lenguajeGB['smsChatAn7']()}`, lenguajeGB.smsChatAn8() + wm, null, [[lenguajeGB.smsChatAn9(), `.leave`]], m)
let room = Object.values(this.anonymous).find(room => room.state === 'WAITING' && !room.check(m.sender))
if (room) {
await this.sendMessage(room.a, { text: `${lenguajeGB['smsChatAn10']()}`}, { quoted: m })
//this.sendButton(room.a, `${lenguajeGB['smsChatAn10']()}`, lenguajeGB.smsChatAn11() + wm, null, [[lenguajeGB.smsChatAn12(), `.next`]], m)
room.b = m.sender
room.state = 'CHATTING'
await this.sendMessage(m.chat, { text: `${lenguajeGB['smsChatAn10']()}`}, { quoted: m })
//this.sendButton(m.chat, `${lenguajeGB['smsChatAn10']()}`, lenguajeGB.smsChatAn11() + wm, null, [[lenguajeGB.smsChatAn12(), `.next`]], m)
} else {
let id = + new Date
this.anonymous[id] = {
id,
a: m.sender,
b: '',
state: 'WAITING',
check: function (who = '') {
return [this.a, this.b].includes(who)
},
other: function (who = '') {
return who === this.a ? this.b : who === this.b ? this.a : ''
},
}
await this.sendMessage(m.chat, { text: `${lenguajeGB['smsChatAn13']()}`}, { quoted: m })
//this.sendButton(m.chat, `${lenguajeGB['smsChatAn13']()}`, lenguajeGB.smsChatAn8() + wm, null, [[lenguajeGB.smsChatAn9(), `.leave`]], m)
}
break
}}}
handler.help = ['start', 'leave', 'next']
handler.tags = ['anonymous']
handler.command = ['start', 'leave', 'next']
handler.private = true
export default handler