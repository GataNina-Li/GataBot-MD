let handler = async (m, { conn, text }) => {
let id = m.chat
conn.math = conn.math ? conn.math : {}
if (id in conn.math) {
clearTimeout(conn.math[id][3])
delete conn.math[id]
m.reply('π¨ ππ ππΌππΌπ πππΌπππΌ!!\nπΏπ πππ πΎπππΌπ!!')
}
let val = text
.replace(/[^0-9\-\/+*ΓΓ·ΟEe()piPI/]/g, '')
.replace(/Γ/g, '*')
.replace(/Γ·/g, '/')
.replace(/Ο|pi/gi, 'Math.PI')
.replace(/e/gi, 'Math.E')
.replace(/\/+/g, '/')
.replace(/\++/g, '+')
.replace(/-+/g, '-')
let format = val
.replace(/Math\.PI/g, 'Ο')
.replace(/Math\.E/g, 'e')
.replace(/\//g, 'Γ·')
.replace(/\*Γ/g, 'Γ')
try {
console.log(val)
let result = (new Function('return ' + val))()
if (!result) throw result
m.reply(`*${format}* = _${result}_`)
} catch (e) {
if (e == undefined) throw `${mg}πππππππ πππΌ πππππΌπΎπππ ππΌππππΌπππΎπΌ ππΌππΌ πΎπΌππΎπππΌπ ππ πππππππΌπΏπ/n/nπππππ πΌ ππΌπππππΌπππΎπΌπ πππππΌππππ ππ πΎπΌππΎπππΌππ πππ ππππππ`
throw `${fg}ππππ ππ πΌπΏπππππ πππππππ π ππππ½ππππ, ππππ ππππ½πππ πΌππΏ ππππ½πππ πΌππ πΌππππππΏ -, +, * , /, Γ, Γ·, Ο, e, (, )*`
}}
handler.help = ['calc <expression>']
handler.tags = ['tools']
handler.command = /^(calc(ulat(e|or))?|kalk(ulator)?)$/i
handler.exp = 5
export default handler
