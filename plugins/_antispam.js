/*let handler = m => m

handler.before = async function (m, { conn, isAdmin }) {
  //if (m.isGroup && isAdmin) return null

  let chat = global.db.data.chats[m.chat]
  let delet = m.key.participant
  let bang = m.key.id
  let bot = global.db.data.settings[this.user.jid] || {}
  let user = global.db.data.users[m.sender]

  if (bot.antiSpam) {
    this.spam = this.spam ? this.spam : {}
    if (!(m.sender in this.spam)) {
      let spaming = {
        jid: await m.sender,
        spam: 0,
        lastspam: 0
      }
      this.spam[spaming.jid] = spaming
    } else try {
      this.spam[m.sender].spam += 1

      if (new Date() - this.spam[m.sender].lastspam > 2000) {
        this.spam[m.sender].spam = 0
        this.spam[m.sender].lastspam = new Date()

        let tiempo = 2000
        let limiteMensajes = 5

        if (this.spam[m.sender].spam > limiteMensajes) {
          let texto = `*@${m.sender.split("@")[0]} No hagas spam, por favor.*`
          
          if (new Date() - user.antispam < tiempo) return
          await conn.reply(m.chat, texto, m, { mentions: this.parseMention(texto) })
          //user.banned = true
          
          await conn.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet } })
          user.antispam = new Date()
        }
      }
    } catch (e) {
      console.log(e)
      m.reply(lenguajeGB.smsMalError())
    }
  }
}

export default handler*/

const userSpamData = {}
let handler = m => m
handler.before = async function (m, { conn }) {

    const sender = m.sender
    const currentTime = new Date().getTime()
    const timeWindow = 5000  
    const messageLimit = 5  

    if (!(sender in userSpamData)) {
        userSpamData[sender] = {
            lastMessageTime: currentTime,
            messageCount: 1,
        }
    } else {
        const userData = userSpamData[sender]
        const timeDifference = currentTime - userData.lastMessageTime

        if (timeDifference <= timeWindow) {
            userData.messageCount += 1

            if (userData.messageCount >= messageLimit) {
                
                const mention = `@${sender.split("@")[0]}`
                const warningMessage = `Baneado ${mention} por enviar spam.`
                conn.reply(m.chat, warningMessage, m);

                

                
                userData.messageCount = 1;
            }
        } else {
            
            if (timeDifference >= 2000) {
                userData.messageCount = 1;
            }
        }
userData.lastMessageTime = currentTime;
}
}

export default handler
