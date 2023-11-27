import fs from 'fs'

let handler = async (m, { conn, text, usedPrefix, command }) => {
const yaoiImages = require('yaoi-images');
const resultJson = yaoiImages.getRandomImage()
m.reply(resultJson)
  

}

handler.command = /^(prueba36)$/i
export default handler
