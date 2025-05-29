import ws from 'ws'

const handler = async (m, { conn }) => {

    let numBot = conn.user.lid.replace(/:.*/, '')
    let numBot2 = global.conn.user.lid.replace(/:.*/, '')
    const detectwhat = m.sender.includes('@lid') ? `${numBot2}@lid` : global.conn.user.jid
    const detectwhat2 = m.sender.includes('@lid') ? `${numBot}@lid` : conn.user.jid;
    const pref = m.sender.includes('@lid') ? `@lid` : `@s.whatsapp.net`

    const subBots = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => detectwhat2)])]

    if (!subBots.includes(detectwhat)) {
        subBots.push(detectwhat)
    }

    const who = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : false
    const chat = globalThis.db.data.chats[m.chat]

    if (!who) return conn.reply(m.chat, `✧ Por favor menciona un bot para convertirlo en primario.`, m)
    if (!who.includes('@lid')) return conn.reply(m.chat, `✧ El bot mencionado debe ser un subbot con @lid.`, m)
    if (!subBots.includes(who)) return conn.reply(m.chat, `✧ El usuario mencionado no es un subbot activo.`, m)
    if (chat.primaryBot === who) {
        return conn.reply(m.chat, `@${who.split`@`[0]} ya es el Bot principal del Grupo.`, m, { mentions: [who] });
    }

    try {
        chat.primaryBot = who
        conn.reply(m.chat, `✩ Se ha establecido a @${who.split`@`[0]} como bot primario de este grupo.\n> Ahora todos los comandos de este grupo serán ejecutados por @${who.split`@`[0]}.`, m, { mentions: [who] })
    } catch (e) {
        await m.reply(`✎ No pudimos guardar la información esta vez.\n> *Si crees que es un fallo, pásate por el grupo de soporte y lo revisamos juntos.*`)
    }
}

handler.help = ['setprimary <@tag>'];
handler.tags = ['jadibot'];
handler.command = ['setprimary'];
handler.group = true;
handler.admin = true;

export default handler;