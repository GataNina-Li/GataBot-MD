import axios from 'axios'
import cheerio from 'cheerio'

const apkpureApi = 'https://apkpure.com/api/v2/search?q='
const apkpureDownloadApi = 'https://apkpure.com/api/v2/download?id='

async function searchApk(text) {
  const response = await axios.get(`${apkpureApi}${encodeURIComponent(text)}`)
  const data = response.data
  return data.results
}

async function downloadApk(id) {
  const response = await axios.get(`${apkpureDownloadApi}${id}`)
  const data = response.data
  return data
}

let handler = async (m, {conn, usedPrefix, command, text}) => {
  if (!text) throw `${lenguajeGB['smsAvisoMG']()} ${mid.smsApk}`
  try {
    const searchResults = await searchApk(text)
    const apkData = await downloadApk(searchResults[0].id)
    const response = `${eg}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃💫 ${mid.name}: ${apkData.name}
┃📦 𝙋𝘼𝘾𝙆𝘼𝙂𝙀: ${apkData.package}
┃🕒 ${mid.smsApk2}: ${apkData.lastup}
┃💪 ${mid.smsYT11} ${apkData.size}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃ ${mid.smsApk3} 🚀🚀🚀`
    await conn.sendMessage(m.chat, {image: {url: apkData.icon}, caption: response}, {quoted: m})
    if (apkData.size.includes('GB') || apkData.size.replace(' MB', '') > 999) {
      return await conn.sendMessage(m.chat, {text: mid.smsApk4}, {quoted: m})
    }
    await conn.sendMessage(
      m.chat,
      {
        document: {url: apkData.dllink},
        mimetype: 'application/vnd.android.package-archive',
        fileName: apkData.name + '.apk',
        caption: null
      },
      {quoted: m}
    )
  } catch (e) {
    await conn.reply(m.chat, `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, m)
    console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
    console.log(e)
    handler.limit = false
  }
}

handler.command = /^(apkp|apkpure|apkdl)$/i
handler.register = true
handler.limit = 2
export default handler
