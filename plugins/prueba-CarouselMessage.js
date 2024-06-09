let handler = async (m, { conn, usedPrefix, command, text }) => {

const messages = [
['Descripción 1', 'Footer 1', 'https://telegra.ph/file/b31cd03f716d362b33716.jpg', [], '', [], []],
['Descripción 2', 'Footer 2', 'https://telegra.ph/file/98c672926fbc35a4b9948.jpg', [], '', [], []],
['Descripción 3', 'Footer 3', 'https://telegra.ph/file/f689a972cfc1c5efff189.jpg', [], '', [], []],
]
await conn.sendCarousel(m.chat, 'Prueba', 'SuperBot', messages, m)

}

handler.command = /^(carousel)$/i
export default handler
