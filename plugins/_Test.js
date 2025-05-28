let handler = async (m, { conn }) => {
    const userLid = m.sender;
    await conn.sendMessage(m.chat, { text: `${userLid}` }, { quoted: m });
};

handler.command = ['test'];

export default handler;