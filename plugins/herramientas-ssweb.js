import fetch from 'node-fetch' 
const handler = async (m, {conn, text, args, usedPrefix, isPrems}) => {   
if (!args[0]) return conn.reply(m.chat, '*Por favor ingresa una url de la página a la que se le tomará captura 🔎*', m)  
let user = global.db.data.users[m.sender]
let calidad, webIMG 
try {  
if (!user.premiumTime) {
calidad = '1280x720' //HD
webIMG = `https://api.screenshotmachine.com/?key=c04d3a&url=${args[0]}&screenshotmachine.com&dimension=${calidad}`
await conn.sendMessage(m.chat, { image: { url: webIMG }, caption: `🎟️ *PREMIUM:* ${user.premiumTime > 0 ? '✅' : '❌'}\n🪄 *CALIDAD:* \`\`\`(${calidad}) HD\`\`\`\n\n👑 _Para una imagen en *4K*, adquiera un pase usando *${usedPrefix}pase premium*_` }, { quoted: m }) 
} else {
calidad = '3840x2160' //4K
webIMG = `https://api.screenshotmachine.com/?key=c04d3a&url=${args[0]}&screenshotmachine.com&dimension=${calidad}`
await conn.sendMessage(m.chat, { image: { url: webIMG }, caption: `🎟️ *PREMIUM:* ${user.premiumTime > 0 ? '✅' : '❌'}\n👑 *CALIDAD:* \`\`\`(${calidad}) 4K\`\`\`` }, { quoted: m }) 
}} catch { 
m.reply("Error.")
}} 

handler.command = /^ss(web)?f?$/i  
export default handler
