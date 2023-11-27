import fs from 'fs'
import yaoiImages from 'module-gatadios'

let handler = async (m, { conn }) => {
const resultJson = yaoiImages.getRandomImage()
m.reply(resultJson.text())
}

handler.command = /^(prueba36)$/i
export default handler
