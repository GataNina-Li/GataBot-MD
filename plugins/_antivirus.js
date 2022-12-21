let handler = m => m

handler.all = async function (m, { isBotAdmin }) {
// borrado automático cuando hay un mensaje que no se puede ver en el escritorio | auto clear ketika terdapat pesan yang tidak dapat dilihat di wa desktop 
if (m.messageStubType === 68) {
let log = {
key: m.key,
content: m.msg,
sender: m.sender
}
await this.modifyChat(m.chat, 'clear', {
includeStarred: false
}).catch(console.log)
}}
export default handler
