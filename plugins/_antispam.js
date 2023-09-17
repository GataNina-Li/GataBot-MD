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

export async function all(m) {
    if (!m.message)
        return
    this.spam = this.spam ? this.spam : {}
    let chat = global.db.data.chats[m.chat]
    let bot = global.db.data.settings[this.user.jid] || {}
    if (bot.antiSpam) {
        if (m.sender in this.spam) {
            this.spam[m.sender].count++
            if (m.messageTimestamp.toNumber() - this.spam[m.sender].lastspam > 5) {
                if (this.spam[m.sender].count > 5) {
                    global.db.data.users[m.sender].banned = true
                    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? this.user.jid : m.sender
                    let caption = ` Banned *@${who.split("@")[0]}* No hacer spam`
                    this.reply(m.chat, caption, m)
                }
                this.spam[m.sender].count = 0
                this.spam[m.sender].lastspam = m.messageTimestamp.toNumber()
            }
        }
        else
            this.spam[m.sender] = {
                jid: m.sender,
                count: 0,
                lastspam: 0
            }
    }
}
