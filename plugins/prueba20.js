import fs from 'fs'
import yaoiImages from 'module-gatadios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
const resultJson = yaoiImages.getRandomImage()
m.reply(resultJson)
}

handler.command = /^(prueba36)$/i
export default handler
