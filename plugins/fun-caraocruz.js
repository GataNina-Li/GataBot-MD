let handler = async (m, { conn, command, text, usedPrefix }) => {
let pp = './Menu2.jpg'
let hasil = Math.floor(Math.random() * 50)
let moneda = `*Moneda lanzada*
Resultado: ${['cara', 'cruz'].getRandom()} `.trim()

conn.sendButton(m.chat, moneda, wm,  pp,
[
['Volver a lanzar', `#lanzar`]], m)}


handler.tags = ['fun']
handler.command = /^lanzar|apakah$/i
//handler.exp = 0
export default handler
