import uploadFile from '../lib/uploadFile.js';
import upload from '../lib/uploadFile2.js';
import uploadImage from '../lib/uploadImage.js';
const handler = async (m) => {
const q = m.quoted ? m.quoted : m;
const mime = (q.msg || q).mimetype || '';
if (!mime) throw `${mg} ${mid.smsconvert10}`
const media = await q.download();
try {
const isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime);
const link = await (isTele ? uploadImage : uploadFile)(media);
m.reply(link);
} catch (e) {
try {    
const link = await upload(media);
m.reply(link);
} catch (e) {
console.log(e) 
}}}
handler.help = ['tourl']
handler.tags = ['herramientas']
handler.command = /^(tourl|upload)$/i
export default handler
