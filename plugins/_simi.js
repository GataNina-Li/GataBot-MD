import fetch from 'node-fetch'
let handler = m => m

handler.before = async (m) => {
if (m.fromMe) return
let chat = global.db.data.chats[m.chat]
if (chat.simi) {
if (/^.*false|disnable|(turn)?off|0/i.test(m.text)) return
if (!m.text) return
let textodem = m.text  
if (m.text.includes('serbot') || m.text.includes('bots')|| m.text.includes('jadibot')|| m.text.includes('menu')|| m.text.includes('play')|| m.text.includes('play2') || m.text.includes('playdoc') || m.text.includes('tiktok') || m.text.includes('facebook') || m.text.includes('menu2') ||  m.text.includes('infobot') || m.text.includes('estado') ||  m.text.includes('ping') ||  m.text.includes('instalarbot') ||  m.text.includes('sc') ||  m.text.includes('sticker') ||  m.text.includes('s') || m.text.includes('wm') ||  m.text.includes('qc')) return  
try {
await conn.sendPresenceUpdate('composing', m.chat)
//let ressimi = await fetch(`https://api.simsimi.net/v2/?text=${encodeURIComponent(m.text)}&lc=` + lenguajeGB.lenguaje())
//let data = await ressimi.json();
let simsimi = await fetch(`${apis}/tools/simi?text=${encodeURIComponent(textodem)}`)
let res = await simsimi.json() 
if (data.success == 'No s\u00e9 lo qu\u00e9 est\u00e1s diciendo. Por favor ense\u00f1ame.') return m.reply(`${lol}`) /* EL TEXTO "lol" NO ESTA DEFINIDO PARA DAR ERROR Y USAR LA OTRA API */
await m.reply(res.data.message) 
//await m.reply(data.success)
} catch {
/* SI DA ERROR USARA ESTA OTRA OPCION DE API DE IA QUE RECUERDA EL NOMBRE DE LA PERSONA */
if (textodem.includes('Hola')) textodem = textodem.replace('Hola', 'Hello')
if (textodem.includes('hola')) textodem = textodem.replace('hola', 'hello')
if (textodem.includes('HOLA')) textodem = textodem.replace('HOLA', 'HELLO')    
let reis = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=" + textodem)
let resu = await reis.json()  
let nama = m.pushName || '1'
let api = await fetch("http://api.brainshop.ai/get?bid=153868&key=rcKonOgrUFmn5usX&uid=" + nama + "&msg=" + resu[0][0][0])
let res = await api.json()
let reis2 = await fetch("https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=" + res.cnt)
let resu2 = await reis2.json()
await m.reply(resu2[0][0][0])}
return !0
}
return true
}
export default handler
