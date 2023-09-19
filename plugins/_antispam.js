const userSpamData = {}
let handler = m => m
handler.before = async function (m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
const chat = global.db.data.chats[m.chat]
if (!m.isGroup) return
if (chat.modoadmin) return  
if (isOwner || isROwner || isAdmin || !isBotAdmin || isPrems) return
  
let user = global.db.data.users[m.sender]
const sender = m.sender
const currentTime = new Date().getTime()
const timeWindow = 5000 // tiempo límite 
const messageLimit = 10 // cantidad de mensajes en dicho tiempo

let time, time2, time3, mensaje
time = 15000 // 15 seg
time2 = 30000 // 30 seg
time3 = 60000 // 1 min

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
mensaje = `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 15 SEGUNDOS*\n\n*MOTIVO: SPAM DE MENSAJES LEVE*`
await conn.reply(m.chat, mensaje, m, { mentions: [m.sender] })  
}} else if (userData.antiBan === 2) {
if (userData.message2 < 1) {
userData.message2++  
mensaje = `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 30 SEGUNDOS*\n\n*MOTIVO: SPAM DE MENSAJES MODERADO*`
await conn.reply(m.chat, mensaje, m, { mentions: [m.sender] })  
}} else if (userData.antiBan === 3) {
if (userData.message3 < 1) {
userData.message3++  
mensaje = `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 1 MINUTO*\n\n*MOTIVO: SPAM DE MENSAJE ALARMANTE*`
await conn.reply(m.chat, mensaje, m, { mentions: [m.sender] })  
}}

if (timeDifference <= timeWindow) {
userData.messageCount += 1

if (userData.messageCount >= messageLimit) {
const mention = `@${sender.split("@")[0]}`
const warningMessage = `*${mention} ESTA PROHIBIDO HACER SPAM DE MENSAJES!!*`
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
user.banned = false
}}, time) 
  
} else if (userData.antiBan === 2) {
setTimeout(() => {
if (userData.antiBan === 2) {
userData.antiBan = 0
userData.message = 0
userData.message2 = 0
userData.message3 = 0
user.banned = false
}}, time2) 
                
} else if (userData.antiBan === 3) {
setTimeout(() => {
if (userData.antiBan === 3) {
userData.antiBan = 0
userData.message = 0
userData.message2 = 0
userData.message3 = 0
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

