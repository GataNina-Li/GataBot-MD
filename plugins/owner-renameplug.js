import { tmpdir } from 'os'
import { join } from 'path'
import fs from 'fs'
let handler = async (m, { args, text, usedPrefix, command }) => {
	let info = `${usedPrefix + command} <Antiguo nombre> | <Nuevo nombre>
*📌_ • Ejemplo:_*
➞ ${usedPrefix + command} inv | rpg-inv
*_🗒️ • Nota:_*
no use la palabra .js al final de la oracion y trate que la palabra no lleve espacios "rpg- inv"`
if (!args[0]) throw info
if (!args[1] == "|") throw `• *📌_ • Ejemplo:_*:
➞ ${usedPrefix + command} inv | rpg-inv`
if (!args[2]) throw `• example:
➞ ${usedPrefix + command} inv | rpg-inv`

let from = args[0]
let to = args[2]

let ar = Object.keys(plugins)
    let ar1 = ar.map(v => v.replace('.js', ''))
    if (!ar1.includes(args[0])) return m.reply(`*🗃️ NO ENCONTRADO!*\n==================================\n\n${ar1.map(v => ' ' + v).join`\n`}`)
await fs.renameSync(`./plugins/${from}.js`, `./plugins/${to}.js`)
conn.reply(m.chat, `Succes changes "plugins/${from}.js" to "plugins/${to}.js"`, m)
    
}
handler.help = ['renameplugin'].map(_=> _ + " *<nombre viejo> | <nombre nuevo>*")
handler.tags = ['owner']
handler.command = /^(r(ename(file)?|f)|renameplugin)$/i

handler.mods = true

export default handler
