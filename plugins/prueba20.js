import fs from 'fs'
import yaoiImages from 'module-gatadios'

let handler = async (m, { conn }) => {
const resultJson = yaoiImages.getRandomImage().JSON.parse()
//const jsonText = JSON.stringify(resultJson, null, 2)
m.reply(resultJson.name)
}

handler.command = /^(prueba36)$/i
export default handler
