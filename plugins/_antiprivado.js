const comandos = /piedra|papel|tijera|estado|verificar|code|jadibot --code|--code|creadora|bottemporal|grupos|instalarbot|términos|bots|deletebot|eliminarsesion|serbot|verify|register|registrar|reg|reg1|nombre|name|nombre2|name2|edad|age|edad2|age2|genero|género|gender|identidad|pasatiempo|hobby|identify|finalizar|pas2|pas3|pas4|pas5|registroc|deletesesion|registror|jadibot/i;

let handler = m => m;
handler.before = async function (m, { conn, isOwner, isROwner }) {
    if (m.fromMe) return true;
    if (m.isGroup) return false;
    if (!m.message) return true;

    const regexWithPrefix = new RegExp(`^${prefix.source}\\s?${comandos.source}`, 'i');
    if (regexWithPrefix.test(m.text.toLowerCase().trim())) return true;

    let chat, user, bot, mensaje;
    chat = global.db.data.chats[m.chat];
    user = global.db.data.users[m.sender];
    bot = global.db.data.settings[this.user.jid] || {};

    if (bot.antiPrivate && !isOwner && !isROwner) {
        return false;
    }
    
    return false;
};
export default handler;
