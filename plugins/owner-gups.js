let handler = async(m, { conn, text }) => {
 var url= await conn.groupInviteCode(`${text}`) 
m.reply("https://chat.whatsapp.com/" + url)}
handler.command = ['prueba1']
export default handler