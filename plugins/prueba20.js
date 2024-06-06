import fs from 'fs'
import yaoiImages from 'module-gatadios'

let handler = async (m, { conn }) => {
const resultJson = yaoiImages.getRandomImage()

let txt
txt = `
Nombre: ${resultJson.name}

Autor: ${resultJson.author}

Descripción: ${resultJson.description}`
  
conn.sendMessage(m.chat, {image: {url: resultJson.link}, caption: txt.trim()}, {quoted: m})
  
}

handler.command = /^(prueba36)$/i
export default handler
