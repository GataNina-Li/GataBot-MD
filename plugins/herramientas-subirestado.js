import uploadFile from '../lib/uploadFile.js';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text }) => {
    if (!m.quoted && !text) throw '*⚠️ Ingrese un texto o responda a un archivo multimedia para subir como estado.*';

    let media = false;
    let mime = (m.quoted?.mimetype || m.mimetype) || '';
    let url = '';
    let caption = text || '';

    if (/image|video/.test(mime)) {
        media = await m.quoted.download(); 
        if (/video/.test(mime)) {
            url = await uploadFile(media);
        } else {
            url = await uploadImage(media); 
        }
    } else if (/webp/.test(mime)) {
        media = await m.quoted.download();
        url = await uploadFile(media); 
    }

    if (url && /image/.test(mime)) {
        await conn.sendMessage('status@broadcast', { image: { url }, caption });
    } else if (url && /video/.test(mime)) {
        await conn.sendMessage('status@broadcast', { video: { url }, caption });
    } else if (text) {
        await conn.sendMessage('status@broadcast', { text: caption });
    } else {
        throw '*⚠️ No se pudo procesar el archivo o mensaje para subir como estado.*';
    }

    m.reply('*✅ Estado subido con éxito. Asegúrate de que el bot está en tu lista de contactos y viceversa para visualizar los estados.*');
};

handler.help = ['subirestado']
handler.tags = ['General']
handler.command = /^subirestado$/i
handler.register = false
export default handler


/*const colors = [
    0xff26c4dc, 0xff792138,
    0xff8b6990, 0xfff0b330,
    0xffae8774, 0xff5696ff,
    0xffff7b6b, 0xff57c9ff,
    0xff243640, 0xffb6b327,
    0xffc69fcc, 0xff54c265,
    0xff6e257e, 0xffc1a03f,
    0xff90a841, 0xff7acba5,
    0xff8294ca, 0xffa62c71,
    0xffff8a8c, 0xff7e90a3,
    0xff74676a
] 
let handler = async (m, { conn, text }) => {
    let _m = Promise.resolve({ key: { id: '' }})
    if (!m.quoted && !text) throw '*_Ingrese un texto o reponda a algun archivo multimedia_*'
    if (m.quoted && m.quoted.mtype !== 'conversation' && !text) _m = m.quoted.forward('status@broadcast')
    if (m.quoted && m.quoted.mtype === 'conversation' && !text) _m = conn.sendMessage('status@broadcast', {
        text: m.quoted.text,
        textArgb: 0xffffffff,
        backgroundArgb: pickRandom(colors)
    }, 'extendedTextMessage')
    if (!m.quoted && text) _m = conn.sendMessage('status@broadcast', {
        text,
        textArgb: 0xffffffff,
        backgroundArgb: pickRandom(colors)
    }, 'extendedTextMessage')
    if (m.quoted && text) _m = conn.forwardMessage('status@broadcast', await m.quoted.cMod('status@broadcast', text))
    //m.reply((await _m).key.id)
    m.reply('*✅ Estado subido con exito, agenda en tu lista de contactos el número del Bot y pide al propietario del Bot que te agregue a sus contactos para que puedas ver los estados*')
    }
handler.help = ['subirestado']
handler.tags = ['General']
handler.command = /^subirestado$/i
handler.register = false
export default handler

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}
*/
