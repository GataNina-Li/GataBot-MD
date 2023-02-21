
import { createHash } from 'crypto'
let handler = async function (m, { args }) {
if (!args[0]) throw `${ag}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀, 𝙎𝙄 𝙉𝙊 𝙎𝘼𝘽𝙀 𝘾𝙐𝘼𝙇 𝙀𝙎 𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 *#myns*\n\n𝙀𝙉𝙏𝙀𝙍 𝙏𝙃𝙀 𝙎𝙀𝙍𝙄𝘼𝙇 𝙉𝙐𝙈𝘽𝙀𝙍, 𝙄𝙁 𝙔𝙊𝙐 𝘿𝙊𝙉'𝙏 𝙆𝙉𝙊𝙒 𝙒𝙃𝙄𝘾𝙃 𝙄𝙏 𝙄𝙎, 𝙐𝙎𝙀 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 *#myns*`
let user = global.db.data.users[m.sender]
let sn = createHash('md5').update(m.sender).digest('hex').slice(0, 6)	
if (args[0] !== sn) throw `${fg} 𝙑𝙀𝙍𝙄𝙁𝙄𝙌𝙐𝙀 𝙌𝙐𝙀 𝙎𝙀𝘼 𝙀𝙇 𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊, 𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 *#myns* 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙎𝙐 𝙉𝙐𝙈𝙀𝙍𝙊 𝘿𝙀 𝙎𝙀𝙍𝙄𝙀\n\n𝙑𝙀𝙍𝙄𝙁𝙔 𝙄𝙏 𝙄𝙎 𝘾𝙊𝙍𝙍𝙀𝘾𝙏, 𝙐𝙎𝙀 𝙏𝙃𝙀 𝘾𝙊𝙈𝙈𝘼𝙉𝘿 *#myns* 𝙏𝙊 𝙂𝙀𝙏 𝙔𝙊𝙐𝙍 𝙎𝙀𝙍𝙄𝘼𝙇 𝙉𝙐𝙈𝘽𝙀𝙍`

global.db.data.users[m.sender]['registroC'] = false
global.db.data.users[m.sender]['registroR'] = false
user.name = 0
user.age = 0
user.genero = 0
user.identidad = 0
user.pasatiempo = 0
user.premLimit = 1
user.tiempo = 0
user.descripcion = 0
user.registered = false
m.reply(`${eg} 𝙐𝙎𝙏𝙀𝘿 𝙔𝘼 𝙉𝙊 𝙀𝙎𝙏𝘼 𝙍𝙀𝙂𝙄𝙎𝙏𝙍𝘼𝘿𝙊(𝘼)\n\n𝙔𝙊𝙐 𝘼𝙍𝙀 𝙉𝙊 𝙇𝙊𝙉𝙂𝙀𝙍 𝙍𝙀𝙂𝙄𝙎𝙏𝙀𝙍𝙀𝘿 😪`)
}
handler.help = ['', 'ister'].map(v => 'unreg' + v + ' <numero de serie>')
handler.tags = ['xp']
handler.command = /^unreg(ister)?$/i
handler.register = true
export default handler
