import uploadImage from '../lib/uploadImage.js'
import { sticker } from '../lib/sticker.js'

let handler = async (m) => {
try{
    let q = m.quoted ? m.quoted : m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) throw `${mg} ${mid.smsconvert10}`
    let media = await q.download()
    let isImg = /image\/(png|jpe?g|gif)/.test(mime)
    if(isImg){
        let link = await uploadImage(media)
        let stiker = await sticker(null,`https://api.erdwpe.com/api/maker/pet?url=${link}`,global.packname, global.author)
        await conn.sendFile(m.chat, stiker, null, { asSticker: true })}
    else{await conn.reply(m.chat, `Responda a una imagen estática`, m)}}
    catch(e){return await conn.reply(m.chat, `${e}`, m)}
}

handler.command = /^(pet|mascota)$/i
export default handler
