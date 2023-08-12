import JavaScriptObfuscator from 'javascript-obfuscator'

let handler = async(m, { conn, text }) => {
if (!text) return m.reply(`*${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝘼 𝙀𝙇 𝘾𝙊́𝘿𝙄𝙂𝙊 𝙌𝙐𝙀 𝙑𝘼𝙎 𝘼 𝙊𝙁𝙐𝙎𝘾𝘼𝙍*`) 
function obfuscateCode(code) {
  return JavaScriptObfuscator.obfuscate(code, { compact: false, controlFlowFlattening: true, deadCodeInjection: true, simplify: true, numbersToExpressions: true }).getObfuscatedCode();
}
let obfuscatedCode = await obfuscateCode(text);
conn.sendMessage(m.chat, {text: obfuscatedCode}, {quoted: m});
}
handler.command = /^(ofuscar|ofuscador)$/i
export default handler
