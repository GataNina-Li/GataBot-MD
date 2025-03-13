import cp, { exec as _exec } from 'child_process'
import { promisify } from 'util'
let exec = promisify(_exec).bind(cp)
let handler = async (m, { conn, isOwner, isROwner, command, text }) => {
if (!isROwner) return
if (conn.user.jid != conn.user.jid) return
m.react("💻")
let o
try {
o = await exec(command.trimStart()  + ' ' + text.trimEnd())
} catch (e) {
o = e
} finally {
let { stdout, stderr } = o
if (stdout.trim()) m.reply(stdout)
if (stderr.trim()) m.reply(stderr)
}}
handler.help = ['$']
handler.tags = ['owner'];
handler.customPrefix = /^[$] /
handler.command = new RegExp
//handler.rowner = true

export default handler
