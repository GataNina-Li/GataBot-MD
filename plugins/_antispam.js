const userSpamData = {}
let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner, isPrems}) {
const chat = global.db.data.chats[m.chat]
const bot = global.db.data.settings[conn.user.jid] || {}
if (!bot.antiSpam) return
if (m.isGroup && chat.modoadmin) return  
if (m.isGroup) {
if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems) return
}  
let user = global.db.data.users[m.sender]
const sender = m.sender
const currentTime = new Date().getTime()
const timeWindow = 5000 // tiempo límite 
const messageLimit = 10 // cantidad de mensajes en dicho tiempo

let time, time2, time3, mensaje, motive
time = 30000 // 30 seg
time2 = 60000 // 1 min
time3 = 120000 // 2 min 

if (!(sender in userSpamData)) {
userSpamData[sender] = {
lastMessageTime: currentTime,
messageCount: 1, 
antiBan: 0, 
message: 0,
message2: 0,
message3: 0,
}
} else {
const userData = userSpamData[sender]
const timeDifference = currentTime - userData.lastMessageTime

if (userData.antiBan === 1) {
if (userData.message < 1) {
userData.message++  
motive = `${mid.smsNoSpam}`
//mensaje = `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 30 SEGUNDOS*\n\n*MOTIVO: ${motive}*`  
await conn.reply(m.chat, mid.smsNoSpam1(m, motive), m, { mentions: [m.sender] })  
user.messageSpam = motive
}} else if (userData.antiBan === 2) {
if (userData.message2 < 1) {
userData.message2++  
motive =  `${mid.smsNoSpam2}`
//mensaje = `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 1 MINUTO*\n\n*MOTIVO: ${motive}*`
await conn.reply(m.chat, mid.smsNoSpam3(m, motive), m, { mentions: [m.sender] })  
user.messageSpam = motive
}} else if (userData.antiBan === 3) {
if (userData.message3 < 1) {
userData.message3++  
motive = `${mid.smsNoSpam4}`
//mensaje = `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 2 MINUTOS*\n\n*MOTIVO: ${motive}*`
await conn.reply(m.chat, mid.smsNoSpam5(m, motive), m, { mentions: [m.sender] }) 
user.messageSpam = motive
await conn.groupParticipantsUpdate(m.chat, [sender], 'remove')
}}

if (timeDifference <= timeWindow) {
userData.messageCount += 1

if (userData.messageCount >= messageLimit) {
const mention = `@${sender.split("@")[0]}`
const warningMessage = `${mid.smsNoSpam6(mention)}`
if (userData.antiBan > 2) return
await conn.reply(m.chat, warningMessage, m, { mentions: [m.sender] })  
user.banned = true
userData.antiBan++
userData.messageCount = 1
                
if (userData.antiBan === 1) {
setTimeout(() => {
if (userData.antiBan === 1) {
userData.antiBan = 0
userData.message = 0
userData.message2 = 0
userData.message3 = 0
user.antispam = 0
motive = 0
user.messageSpam = 0
user.banned = false
}}, time) 
  
} else if (userData.antiBan === 2) {
setTimeout(() => {
if (userData.antiBan === 2) {
userData.antiBan = 0
userData.message = 0
userData.message2 = 0
userData.message3 = 0
user.antispam = 0
motive = 0
user.messageSpam = 0
user.banned = false
}}, time2) 
                
} else if (userData.antiBan === 3) {
setTimeout(() => {
if (userData.antiBan === 3) {
userData.antiBan = 0
userData.message = 0
userData.message2 = 0
userData.message3 = 0
user.antispam = 0
motive = 0
user.messageSpam = 0
user.banned = false
}}, time3)
    
}}
} else {
if (timeDifference >= 2000) {
userData.messageCount = 1
}}
userData.lastMessageTime = currentTime
}}

export default handler

