import fetch from 'node-fetch'
let handler = async(m, { conn, groupMetadata, usedPrefix, text, args, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙏𝙀𝙓𝙏𝙊 𝙌𝙐𝙀 𝘿𝙀𝙎𝙀𝙀 𝘽𝙐𝙎𝘾𝘼𝙍\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊: ${usedPrefix + command} Hola*`
let anu = await ringtone(text)
let result = anu[Math.floor(Math.random() * anu.length)]
conn.sendMessage(m.chat, { audio: { url: result.audio }, fileName: result.title+'.mp3', mimetype: 'audio/mpeg' }, { quoted: m })}
handler.command  = ['ringtone']
handler.money = 100
handler.level = 2
handler.register = true
export default handler
async function ringtone(title) {
return new Promise((resolve, reject) => {
axios.get('https://meloboom.com/es/search/'+title).then((get) => {
let $ = cheerio.load(get.data)
let hasil = []
$('#__next > main > section > div.jsx-2244708474.container > div > div > div > div:nth-child(4) > div > div > div > ul > li').each(function (a, b) {
hasil.push({ title: $(b).find('h4').text(), source: 'https://meloboom.com/'+$(b).find('a').attr('href'), audio: $(b).find('audio').attr('src') })
})
resolve(hasil)})})}

