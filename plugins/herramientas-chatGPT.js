import fetch from 'node-fetch'
import axios from 'axios'
import translate from '@vitalets/google-translate-api'
import { Configuration, OpenAIApi } from 'openai'
const configuration = new Configuration({ organization: global.openai_org_id, apiKey: global.openai_key });
const openaiii = new OpenAIApi(configuration);
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (usedPrefix == 'a' || usedPrefix == 'A') return    
if (!text) throw `*${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉𝘼 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉 𝙊 𝙐𝙉𝘼 𝙊𝙍𝘿𝙀𝙉 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝘾𝙃𝘼𝙏𝙂𝙋𝙏\n\n❏ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝘿𝙀 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉𝙀𝙎 𝙔 𝙊𝙍𝘿𝙀𝙉𝙀𝙎\n❏ ${usedPrefix + command} Recomienda un top 10 de películas de acción\n❏ ${usedPrefix + command} Codigo en JS para un juego de cartas`     
try {
conn.sendPresenceUpdate('composing', m.chat)  
let chgptdb = global.chatgpt.data.users[m.sender];
chgptdb.push({ role: 'user', content: text });
const config = { method: 'post', url: 'https://api.openai.com/v1/chat/completions', headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + global.openai_key }, data: JSON.stringify({ 'model': 'gpt-3.5-turbo', 'messages': [{ role: 'system', content: 'Actuaras como un Bot de WhatsApp el cual fue creado por GataNina-Li, tu seras GataBot-MD' }, ...chgptdb ]})}
let response = await axios(config);
chgptdb.push({ role: 'assistant', content: response.data.choices[0].message.content }) 
if (response.data.choices[0].message.content == 'error' || response.data.choices[0].message.content == '' || !response.data.choices[0].message.content) return XD //causar error undefined para usar otra api    
m.reply(`${response.data.choices[0].message.content}`.trim())
} catch {
try {
const botIA222 = await openaiii.createCompletion({ model: "text-davinci-003", prompt: text, temperature: 0.3, max_tokens: 4097, stop: ["Ai:", "Human:"], top_p: 1, frequency_penalty: 0.2, presence_penalty: 0, })
if (botIA222.data.choices[0].text == 'error' || botIA222.data.choices[0].text == '' || !botIA222.data.choices[0].text) return XD //causar error undefined para usar otra api
m.reply(botIA222.data.choices[0].text.trim())    
} catch {
try { 
let akuariapi1 = await fetch(`https://api.akuari.my.id/ai/gbard?chat=${text}`)
let akuariapijson1 = await akuariapi1.json()
if (akuariapijson1.respon == 'error' || akuariapijson1.respon == '' || !akuariapijson1.respon) return XD //causar error undefined para usar otra api 
let akuariapiresult1 = await translate(`${akuariapijson1.respon}`, { to: 'es', autoCorrect: true })
m.reply(`${akuariapiresult1.text}`.trim())         
} catch {
try {
let tioress22 = await fetch(`https://api.lolhuman.xyz/api/openai?apikey=${lolkeysapi}&text=${text}&user=${m.sender}`)
let hasill22 = await tioress22.json()
if (hasill22.result == 'error' || hasill22.result == '' || !hasill22.result) return XD //causar error undefined para usar otra api 
let hasill22_result = await translate(`${hasill22.result}`, { to: 'es', autoCorrect: true })  
m.reply(`${hasill22_result.text}`.trim())         
} catch {
try {  
const searchString2 = " Indonesia "
const replacementString2 = ' español '
let rres = await fetch(`https://api.ibeng.tech/api/others/chatgpt?q=Hola&apikey=eMlBNRzUXv`)
let jjson = await rres.json()
let hahaha = await translate(`${jjson.data}`, { to: 'es', autoCorrect: true })
let sextS = hahaha.text
let replacedText = sextS.replace(searchString2, replacementString2).trim()
m.reply(replacedText)
} catch {    
try {   
let akuariapi2 = await fetch(`https://api.akuari.my.id/ai/gpt?chat=${text}`)
let akuariapijson2 = await akuariapi2.json()
if (akuariapijson2.respon == 'error' || akuariapijson2.respon == '' || !akuariapijson2.respon) return XD //causar error undefined para lanzar msg de error
let akuariapiresult2 = await translate(`${akuariapijson2.respon}`, { to: 'es', autoCorrect: true })
m.reply(akuariapiresult2.text.trim())    
} catch {    
try {   
let syms1 = `Actuaras como un Bot de WhatsApp el cual fue creado por GataNina-Li, tu seras GataBot-MD`  
let fgapi1 = await fetch(`https://api-fgmods.ddns.net/api/info/openai?text=${text}&symsg=${syms1}&apikey=fg-dylux`)
let fgjson1 = await fgapi1.json()
if (fgjson1.result == 'error' || fgjson1.result == '' || !fgjson1.result) return XD //causar error undefined para lanzar msg de error
let fgjson1_result = await translate(`${fgjson1.result}`, { to: 'es', autoCorrect: true })  
m.reply(fgjson1_result.text.trim())    
} catch {    
}}}}}}}}
handler.command = ['openai', 'chatgpt', 'ia', 'robot']
export default handler
