let handler = async (m, { conn, command, usedPrefix }) => {
/*let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
let cafirexos = `
_Optimice la implementación de *GataBot* mediante la integración en un servicio de alojamiento de alto rendimiento._

*🐈 Compatible con GataBot*
Aprovecha la compatibilidad y comienza usar GataBot en servidores de alto rendimiento. El Staff de GataBot y Cafirexos hacen posible que puedas ejecutar las funciones que tanto te gusta usar sintiendo una experiencia fluida y de calidad.

🔵 \`\`\`Información del Host\`\`\`

💻 *Página*
https://www.cafirexos.com

✨ *Dashboard*
https://dash.cafirexos.com

⚙️ *Panel*
https://panel.cafirexos.com

📢 *Canal de WhatsApp*
https://whatsapp.com/channel/0029VaFVSkRCMY0KFmCMDX2q

💥 *Grupo de WhatsApp*
https://chat.whatsapp.com/FBtyc8Q5w2iJXVl5zGJdFJ

📧 *Correo*
contacto@cafirexos.com

🧑‍💻 *Contacto (Diego Flores)*
https://wa.me/50497150165
`
await conn.sendFile(m.chat, 'https://grxcwmcwbxwj.objectstorage.sa-saopaulo-1.oci.customer-oci.com/n/grxcwmcwbxwj/b/cafirexos/o/logos%2Flogo.png', 'fantasy.jpg', cafirexos.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: true,
renderLargerThumbnail: false,
title: `🔵 C A F I R E X O S 🔵`,
body: `✅ Hosting de Calidad`,
mediaType: 1,
sourceUrl: accountsgb.getRandom(),
thumbnailUrl: 'https://grxcwmcwbxwj.objectstorage.sa-saopaulo-1.oci.customer-oci.com/n/grxcwmcwbxwj/b/cafirexos/o/logos%2Flogo_2.png'
}}
}, { mentions: m.sender })
*/
const _0x572fea=_0x5d94;function _0x5764(){const _0x540b4f=['trim','25AkIaql','1302tFbktM','2820968mCdwOa','𝐁𝐢𝐱𝐛𝐲𝐁𝐨𝐭-𝐌𝐝\x20🔮','jid','Versión:\x20','5316839XkdkgU','image','1891116WEFlbo','https://telegra.ph/file/8ca14ef9fa43e99d1d196.jpg','10nFigCL','30sGYXFd','303904otppZO','182579kPTrBd','Únete\x20:\x20','BEGIN:VCARD\x0aVERSION:3.0\x0aN:Sy;Bot;;;\x0aFN:y\x0aitem1.TEL;waid=','chat','sender','\x0aitem1.X-ABLabel:Ponsel\x0aEND:VCARD','split','quoted','sendMessage','38328TRcSGR','fromMe','catch','\x0aTexto\x20principal','mentionedJid','getName','774ddAErV','0@s.whatsapp.net','profilePictureUrl'];_0x5764=function(){return _0x540b4f;};return _0x5764();}(function(_0x596e02,_0x1b4815){const _0x28ba3f=_0x5d94,_0x2aca00=_0x596e02();while(!![]){try{const _0x1c9a85=-parseInt(_0x28ba3f(0x159))/0x1+parseInt(_0x28ba3f(0x157))/0x2*(-parseInt(_0x28ba3f(0x142))/0x3)+parseInt(_0x28ba3f(0x158))/0x4*(parseInt(_0x28ba3f(0x14c))/0x5)+-parseInt(_0x28ba3f(0x148))/0x6*(parseInt(_0x28ba3f(0x14d))/0x7)+-parseInt(_0x28ba3f(0x14e))/0x8+parseInt(_0x28ba3f(0x154))/0x9*(parseInt(_0x28ba3f(0x156))/0xa)+parseInt(_0x28ba3f(0x152))/0xb;if(_0x1c9a85===_0x1b4815)break;else _0x2aca00['push'](_0x2aca00['shift']());}catch(_0x2e09c4){_0x2aca00['push'](_0x2aca00['shift']());}}}(_0x5764,0x4ebd7));function _0x5d94(_0x15df2b,_0x424196){const _0x5764ce=_0x5764();return _0x5d94=function(_0x5d948c,_0x19cc5d){_0x5d948c=_0x5d948c-0x141;let _0x4b65c0=_0x5764ce[_0x5d948c];return _0x4b65c0;},_0x5d94(_0x15df2b,_0x424196);}let who=m[_0x572fea(0x160)]?m[_0x572fea(0x160)]['sender']:m[_0x572fea(0x146)]&&m['mentionedJid'][0x0]?m['mentionedJid'][0x0]:m[_0x572fea(0x143)]?conn['user'][_0x572fea(0x150)]:m[_0x572fea(0x15d)],pp=await conn[_0x572fea(0x14a)](who,_0x572fea(0x153))[_0x572fea(0x144)](_0x6763e1=>_0x572fea(0x155)),nomeDelBot=_0x572fea(0x14f),prova={'key':{'participants':_0x572fea(0x149),'fromMe':![],'id':'Halo'},'message':{'locationMessage':{'name':''+nomeDelBot,'jpegThumbnail':pp,'vcard':_0x572fea(0x15b)+m['sender'][_0x572fea(0x15f)]('@')[0x0]+':'+m['sender'][_0x572fea(0x15f)]('@')[0x0]+_0x572fea(0x15e)}},'participant':_0x572fea(0x149)},name=await conn[_0x572fea(0x147)](m[_0x572fea(0x15d)]),text=_0x572fea(0x145)[_0x572fea(0x14b)]();conn[_0x572fea(0x141)](m[_0x572fea(0x15c)],{'text':text,'contextInfo':{'externalAdReply':{'title':_0x572fea(0x15a)+name+'\x20','body':_0x572fea(0x151)+vs,'previewType':'PHOTO','thumbnail':thumbnail,'sourceUrl':'https://whatsapp.com/channel/0029Va8SHGnId7nJi8Zdnz3x','mediaType':0x1}}},{'quoted':prova});
  
}
handler.command = /^(cafirexos|prueba38)$/i
export default handler
