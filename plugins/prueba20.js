import fs from 'fs'
import yaoiImages from 'module-gatadios'

let handler = async (m, { conn }) => {
const resultJson = yaoiImages.getRandomImage()
//const jsonText = JSON.stringify(resultJson, null, 2)
m.reply(resultJson)
}

handler.command = /^(prueba36)$/i
export default handler
