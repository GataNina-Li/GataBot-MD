let handler = async (m, { conn, command, usedPrefix }) => {
let cafirexostxt = `
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
handler.command = /^(cafirexos|prueba38)$/i
export default handler
