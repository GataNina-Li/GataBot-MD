/*Código en proceso de desarrollo*/

let handler = async(m, { conn, command }) => {

let text = `*_☘️ El Owner @${m.sender.split`@`[0]} ha empezado una reunión y por eso se te ha mandado este mensaje, dirigirse al grupo de Staff lo más pronto posible ya que puede tratarse de un asunto importante._*
sᴛᴀғғ ɢᴀᴛᴀʙᴏᴛ`
m.reply('*_💫 Enviando mensaje de reunión a todos los owners._*')
                        
                           // conn.reply(data.jid, text, m, { mentions: [m.sender] })  }

}
handler.tags = ['owner']
handler.command = handler.help =['reunionstaff']
handler.rowner = true

export default handler
