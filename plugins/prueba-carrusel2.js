import { pinterest } from '@bochilteam/scraper';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `*⚠️ Ejemplo:* ${usedPrefix + command} Loli`;

  try {

    const json = await pinterest(text);

    const messages = json.map(img => [
      `${text}`, 
      wm,      
      img,                        
      [['Siguiente', usedPrefix + 'pinterest ' + text]]
    ]);

    await conn.sendCarousel(m.chat, 'Explora más imágenes', 'Siguiente', 'Carrusel de Pinterest', messages, m);

  } catch (error1) {
    try {
      const response = await fetch(`https://deliriussapi-oficial.vercel.app/search/pinterest?text=${text}`);
      const dataR = await response.json();
      const json = dataR.result;

      const messages = json.map(img => [
    `${text}`, 
      wm,      
      img,     
        [['Siguiente', usedPrefix + 'pinterest ' + text]] 
      ]);

      await conn.sendCarousel(m.chat, 'Explora más imágenes', 'Siguiente', 'Carrusel de Pinterest', messages, m);
    } catch (e) {
      console.log(e);
    }
  }
};

handler.help = ['pinterest <keyword>'];
handler.tags = ['buscadores'];
handler.command = /^(pinterest2)$/i;
//handler.register = true;
//handler.limit = 1;

export default handler;
