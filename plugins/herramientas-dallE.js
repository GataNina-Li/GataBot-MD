import fetch from 'node-fetch';

const handler = async (m, {conn, text, usedPrefix, command}) => {
    if (!text) throw `${lenguajeGB['smsAvisoMG']()} *𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙏𝙀𝙓𝙏𝙊 𝙋𝘼𝙍𝘼 𝘾𝙍𝙀𝘼𝙍 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝘾𝙊𝙉 𝘿𝘼𝙇𝙇-𝙀 (𝙄𝘼)\n\n*ღ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊:\n*ɞ ${usedPrefix + command} gatitos llorando*\n*ɞ ${usedPrefix + command} Un gato de color morado con celeste estando en Júpiter, iluminando el cosmo con su encanto con un efecto minimalista.*`;
    
    await conn.sendMessage(m.chat, {text: '*⌛ ESPERE UN MOMENTO POR FAVOR...*'}, {quoted: m});
    
    try {
      // api venom xov ❤️
        const response = await fetch(`https://api-xovvip.vercel.app/text2img?text=${encodeURIComponent(text)}`);
        if (!response.ok) throw new Error('Network response was not ok');
        
        const buffer = await response.buffer();
        
        await conn.sendMessage(m.chat, {image: buffer}, {quoted: m});
    } catch {
        throw `${lenguajeGB['smsAvisoFG']()} 𝙀𝙍𝙍𝙊𝙍, (𝘼𝙋𝙄 𝘾𝘼𝙄𝘿𝘼) 𝙑𝙐𝙀𝙇𝘽𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍 𝙈𝘼𝙎 𝙏𝘼𝙍𝘿𝙀𝙎.`;
    }
}

handler.command = ['dall-e', 'dalle', 'ia2', 'cimg', 'openai3', 'a-img', 'aimg', 'imagine'];
export default handler;