/*Código en proceso de desarrollo*/

let handler = async(m, { conn, command }) => {

let text = `*_☘️ El Owner @${m.sender.split`@`[0]} ha empezado una reunión y por eso se te ha mandado este mensaje, dirigirse al grupo de Staff lo más pronto posible ya que puede tratarse de un asunto importante._*
sᴛᴀғғ ɢᴀᴛᴀʙᴏᴛ`
m.reply('*_💫 Enviando mensaje de reunión a todos los owners._*')
m.reply = `*╭━━[ 𝙍𝙀𝙋𝙊𝙍𝙏𝙀 | 𝙍𝙀𝙋𝙊𝙍𝙏 ]━━━⬣*\n*┃*\n*┃* *𝙉𝙐𝙈𝙀𝙍𝙊 | 𝙉𝙐𝙈𝘽𝙀𝙍*\n┃ ✦ Wa.me/${m.sender.split`@`[0]}\n*┃*\n*┃* *𝙈𝙀𝙉𝙎𝘼𝙅𝙀 | 𝙈𝙀𝙎𝙎𝘼𝙂𝙀*\n*┃* ✦ ${text}\n*┃*\n*╰━━━━━━━━━━━━━━━━━━⬣*`
                        
                           // conn.reply(data.jid, text, m, { mentions: [m.sender] })  }

}
handler.tags = ['owner']
handler.command = handler.help =['reunionstaff']
handler.rowner = true

export default handler
