import { tmpdir } from 'os'
import path, { join } from 'path'
import {
readdirSync,
statSync,
unlinkSync,
existsSync,
readFileSync,
watch
} from 'fs'
let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => { 

conn.reply(m.chat, `${eg} *𝘼𝙍𝘾𝙃𝙄𝙑𝙊𝙎 𝘿𝙀 𝙇𝘼 𝘾𝘼𝙍𝙋𝙀𝙍𝙏𝘼 𝙏𝙈𝙋 𝙁𝙐𝙀𝙍𝙊𝙉 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊𝙎.*\n\n*𝙁𝙄𝙇𝙀𝙎 𝙄𝙉 𝙏𝙃𝙀 𝙏𝙈𝙋 𝙁𝙊𝙇𝘿𝙀𝙍 𝙒𝙀𝙍𝙀 𝘿𝙀𝙇𝙀𝙏𝙀𝘿.*`, m)

const tmp = [tmpdir(), join(__dirname, '../tmp')]
const filename = []
tmp.forEach(dirname => readdirSync(dirname).forEach(file => filename.push(join(dirname, file))))
return filename.map(file => {
const stats = statSync(file)
unlinkSync(file)
})} //NO USAR ESTE COMANDO EN HEROKU | DO NOT USE THIS COMMAND ON HEROKU
handler.help = ['cleartmp']
handler.tags = ['owner']
handler.command = /^(cleartmp|cleartemp|borrartmp|eliminartmp|borrartemp|borrartemp)$/i
handler.exp = 500
handler.owner = true
export default handler
