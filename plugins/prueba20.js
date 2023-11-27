import fs from 'fs'
import yaoiImages from 'module-gatadios'

let handler = async (m, { conn }) => {
const resultJson = JSON.parse(yaoiImages.getRandomImage())
//const resultJson = yaoiImages.getRandomImage()
//const jsonText = JSON.stringify(resultJson, null, 2)
//m.reply(resultJson)

let txt
txt = `
Nombre: ${resultJson.name}

Autor: ${resultJson.author}

Descripción: ${resultJson.description}`
  
conn.sendMessage(m.chat, {image: {url: resultJson.link}, caption: txt.trim()}, {quoted: m})
  
}

handler.command = /^(prueba36)$/i
export default handler
