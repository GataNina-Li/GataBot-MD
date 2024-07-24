let handler = async (m, { conn, command, usedPrefix }) => {
let cafirexostxt = `
_Optimice la implementación de *GataBot* mediante la integración en un servicio de alojamiento de alto rendimiento._

*🐈 Compatible con GataBot*
Aprovecha la compatibilidad y comienza usar GataBot en servidores de alto rendimiento. El Staff de GataBot y Cafirexos hacen posible que puedas ejecutar las funciones que tanto te gusta usar sintiendo una experiencia fluida y de calidad.

🔵 \`\`\`Información del Host\`\`\`

💻 *Página*
https://www.cafirexos.com

✨ *Dashboard*
https://dashboard.cafirexos.com

⚙️ *Panel*
https://panel.cafirexos.com

📢 *Canal de WhatsApp*
https://whatsapp.com/channel/0029VaFVSkRCMY0KFmCMDX2q

💥 *Grupo de WhatsApp*
https://chat.whatsapp.com/FBtyc8Q5w2iJXVl5zGJdFJ

📧 *Correo*
contacto@cafirexos.com

🧑‍💻 *Contacto (Diego Flores)*
https://wa.me/50497150165`
let txt = `*¿Tu Nokia es muy lento y necesitas que tu bot esté activo 24/7?* 📱⏳

¡Tenemos la solución perfecta para ti! 🎉 Mantén tu bot funcionando sin interrupciones con nuestros servidores, Ofrecemos servidores gratuitos y de pago a precios súper accesibles, al alcance de todos. 💸 

🖥️ *Totalmente compatible con GataBot:* Disfruta al máximo de su potencial en nuestros servidores de alto rendimiento, asegurando una experiencia fluida y de alta calidad. El staff de GataBot y Infinity-Host se encarga de que disfrutes de todas sus funciones al máximo. 😺✨

🟢 \`\`\`Información del Host\`\`\`

💻 *Página:*
https://www.infinity-wa.com/

*🟢 Dashboard:*
https://dash.infinitywa-host.com

⚙️ *Panel*
https://panel.infinitywa-host.com

💥 *Grupo Support whatsapp:*
https://chat.whatsapp.com/GQ82mPnSYnm0XL2hLPk7FV

*🟣 Discord:*
https://discord.com/invite/vgfpe4Nwd8

🧡 *Canal de WhatsApp:*
${canal1}

🗣📲 *Contacto:*
• https://www.facebook.com/elrebelde21
• wa.me/573147616444

No esperes más y lleva tu bot al siguiente nivel con nuestro servicio de alojamiento. ¡Es fácil, rápido y económico! 💪🚀` 

if (command == 'cafirexos') {
await conn.sendFile(m.chat, 'https://grxcwmcwbxwj.objectstorage.sa-saopaulo-1.oci.customer-oci.com/n/grxcwmcwbxwj/b/cafirexos/o/logos%2Flogo.png', 'fantasy.jpg', cafirexostxt.trim(), fkontak, true, {
contextInfo: {
'forwardingScore': 200,
'isForwarded': false,
externalAdReply: {
showAdAttribution: true,
renderLargerThumbnail: false,
title: `🔵 C A F I R E X O S 🔵`,
body: `✅ Hosting de Calidad`,
mediaType: 1,
sourceUrl: accountsgb,
thumbnailUrl: 'https://grxcwmcwbxwj.objectstorage.sa-saopaulo-1.oci.customer-oci.com/n/grxcwmcwbxwj/b/cafirexos/o/logos%2Flogo_2.png'
}}
}, { mentions: m.sender })
}

if (command == 'infinity' || command == 'infinityWa' || command == 'infohost' || command == 'hosting') {
 await conn.sendMessage(m.chat, { text: txt,
contextInfo:{
forwardingScore: 9999999,
isForwarded: false, 
"externalAdReply": {
"showAdAttribution": true,
"containsAutoReply": true,
title: `🤖 𝐈𝐍𝐅𝐈𝐍𝐈𝐓𝐘𝐖𝐀-𝐇𝐎𝐒𝐓 🤖`,
body: `✅ Hosting de Calidad`,
"previewType": "PHOTO",
thumbnailUrl: 'https://qu.ax/EQTd.jpg', 
sourceUrl: accountsgb}}},
{ quoted: fkontak})
}}

handler.command = /^(cafirexos|infohost|hosting|infinitywa|infinity)$/i
export default handler
