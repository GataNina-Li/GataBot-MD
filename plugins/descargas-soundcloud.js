import axios from 'axios'
let handler = async (m,{ command, args, text, usedPrefix}) => {
if (!text) throw `Ingresa el nombre de la canción a buscar`;
   
}

handler.limit = 1
handler.register = true
handler.command = /^(soundcloud|soundcloudr)$/i
export default handler

const delay = time => new Promise(res => setTimeout(res, time))
