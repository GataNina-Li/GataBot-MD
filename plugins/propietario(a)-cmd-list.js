let handler = async (m, { conn }) => {
conn.reply(m.chat, `ღ 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊/𝙏𝙀𝙓𝙏𝙊𝙎 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊𝙎

${Object.entries(global.db.data.sticker).map(([key, value], index) => `*${index + 1}.-*\n*ღ 𝘾𝙊𝘿𝙄𝙂𝙊:* ${value.locked ? `*(𝚋𝚕𝚘𝚚𝚞𝚎𝚊𝚍𝚘)* ${key}` : key}\n*ღ 𝘾𝙊𝙈𝘼𝙉𝘿𝙊/𝙏𝙀𝙓𝙏𝙊𝙎* ${value.text}`).join('\n\n')}
`.trim(), null, {mentions: Object.values(global.db.data.sticker).map(x => x.mentionedJid).reduce((a, b) => [...a, ...b], [])})
}
handler.command = ['listcmd', 'cmdlist']
handler.rowner = true
export default handler
