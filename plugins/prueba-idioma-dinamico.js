const handler = async (m, {text, command, args, usedPrefix}) => {
let language = 'en'
//m.reply(`${lenguajeGB['smsAvisoAG']()}`, language)
m.reply(m.chat, `${lenguajeGB['smsAvisoAG']()}`, language, null)
} 
handler.command = /^(prueba39)$/i
export default handler
