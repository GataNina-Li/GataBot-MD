let handler = (m) => m
handler.before = async function (m, {conn}) {
  if (!m.chat.endsWith('@s.whatsapp.net')) return !0
  this.anonymous = this.anonymous ? this.anonymous : {}
  let room = Object.values(this.anonymous).find((room) => [room.a, room.b].includes(m.sender) && room.state === 'CHATTING')
  if (room) {
    if (/^.*(next|leave|start)/.test(m.text)) return
    let other = [room.a, room.b].find((user) => user !== m.sender)
    await m.copyNForward(other, true)
  }
  return !0
}
export default handler
