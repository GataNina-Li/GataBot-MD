//CRÉDITOS: https://github.com/Abiguelreyes75

export async function all(m, conn) {
let texto
let user = global.db.data.users[m.sender]  
if (!m.message)
return
if (!user.antispam)
return !0
if (+new Date() > user.antispam) {
let tiempo = 60000 * 1
setTimeout(() => {
//this.updateBlockStatus(m.chat, 'unblock') No me gustó jjjjj
user.banned = false
texto = `*@${m.sender.split("@")[0]} ${lenguajeGB['smsNoSpam2']()}*`
this.sendButton(m.chat, texto, wm, null, [[lenguajeGB.smsConMenu(), '/menu']], m, { mentions: this.parseMention(texto) })}, tiempo)        
user.antispam = null
}}
