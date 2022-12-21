let handler = async (m, { conn, args, command }) => {
	let group = m.chat
        await m.reply('GATABOT ABANDONA EL GRUPO FUE UN GUSTO ESTA AQUI HASTA PRONTO 👋🏻', m.chat) 
        await  conn.groupLeave(group)
        }
handler.help = ['leavegc', 'salir']
handler.tags = ['owner']
handler.command = /^(salir|leavegc)$/i

handler.rowner = true

export default handler
 