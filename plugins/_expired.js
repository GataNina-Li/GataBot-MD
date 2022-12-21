export async function all(m, conn) {
   
if (!m.isGroup)
return
let chats = global.db.data.chats[m.chat]
if (!chats.expired)
return !0
if (+new Date() > chats.expired) {
let caption = `*${this.user.name}* ${lenguajeGB['smsBottem1']()}`
let pp = './media/menus/Menu2.jpg'
    
await this.sendButton(m.chat, caption, lenguajeGB.smsBottem2() + wm, pp, [[lenguajeGB.smsBottem3(), '.hastapronto']], null)
await this.groupLeave(m.chat)
chats.expired = null
}}

