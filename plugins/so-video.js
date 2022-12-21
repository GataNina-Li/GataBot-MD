import fetch from 'node-fetch'
let handler = async (m, { conn, command }) => {
if (!db.data.chats[m.chat].modohorny && m.isGroup) throw `[ ⚠️ ] Los comandos +18 estan desactivados en este grupo, si es administrador de este grupo y desea activarlos escriba #enable modohorny para activar`
let url = video[Math.floor(Math.random() * video.length)]
conn.sendButton(m.chat, `_aqui tiene 😏_`, author, url, [['𝑺𝒊𝒈𝒖𝒊𝒆𝒏𝒕𝒆 😏', `/${command}`]], m)
}
handler.help = ['video']
handler.tags = ['internet']
handler.command = /^(video)$/i
handler.level = 1
handler.register = true
export default handler

global.video = [
  "https://telegra.ph/file/7a36eecc38998e8b6952f.mp4",
  "https://telegra.ph/file/ac12ce067a32fa3ed02b8.mp4",
  "https://telegra.ph/file/7ed6a37803430fdd9f776.mp4",
  "https://telegra.ph/file/5b5a8693227172ad13e56.mp4",
  "https://telegra.ph/file/fb0875e5e79e4c688bf88.mp4",
  "https://telegra.ph/file/d5cfdb3bc573951a16a86.mp4",
  "https://telegra.ph/file/94a67ec7cc0fff5e522f9.mp4",
  "https://telegra.ph/file/d8b36ceb8e4c1e5529e6b.mp4",
  "https://telegra.ph/file/cb60b862b07a9c162beea.mp4",
  "https://telegra.ph/file/4761b9f18dfa632929837.mp4",
  "https://telegra.ph/file/c6ae85d5d75015b370d50.mp4",
  "https://telegra.ph/file/0c34890cb48ab5ec0514a.mp4",
  "https://telegra.ph/file/c23cba8cf6dfbeec14d0f.mp4",
  "https://telegra.ph/file/335b72f17b5d73443b46b.mp4",
  "https://telegra.ph/file/2a755fab658645a2e280f.mp4",
  "https://telegra.ph/file/79da5ea7a00472c655702.mp4",
  "https://telegra.ph/file/482583ae42ee19fba5fc0.mp4",
  "https://telegra.ph/file/da6a8538ad3a99d0df8da.mp4",
]
