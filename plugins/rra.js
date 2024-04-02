let handler = async (m, { conn, usedPrefix, text }) => {
	//await m.reply(`rra.`)
await conn.sendHydrated(m.chat, `rra.`, 'Bot Tiburón🦈', null, null, null, null, null, [
      ['que', 'so'],
      ['Eres', '!tu'],
      [null, null]
	  ], m)
}

handler.customPrefix = /^(so|So)$/i
handler.command = new RegExp
//handler.help = ['javier ']
//handler.tags = ['voces']

handler.fail = null
handler.exp = 0
handler.limit = false
handler.register = true

export default handler
