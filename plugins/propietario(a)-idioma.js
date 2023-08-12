//https://github.com/Fabri115/botwhaita Enjoy:!
import translate from '@vitalets/google-translate-api'
import { es, en, id, ar, pt, it, hi } from '../lib/idiomas/total-idiomas.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let idioma;
    let lenguajeGB;

    if (args[0] == 'es'){
        lenguajeGB = es;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'es', autoCorrect: true });
    } else if (args[0] == 'en'){
        lenguajeGB = en;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'en', autoCorrect: true });
    } else if (args[0] == 'id'){
        lenguajeGB = id;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'id', autoCorrect: true });
    } else if (args[0] == 'ar'){
        lenguajeGB = ar;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'ar', autoCorrect: true });
    } else if (args[0] == 'it'){
        lenguajeGB = it;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'it', autoCorrect: true });
   } else if (args[0] == 'hi'){
        lenguajeGB = hi;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'hi', autoCorrect: true });
    } else if (args[0] == 'pt'){
        lenguajeGB = pt;
        idioma = await translate('*Idioma de GataBot cambiado Correctamente:* ', { to: 'pt', autoCorrect: true });
    } else {
        const idiomasDisponibles = ['es', 'en', 'id', 'ar', 'it', 'pt', 'hi'];
        const idiomasNombres = ['Español', 'English', 'Bahasa Indonesia', 'عرب', 'Italiano', 'Indonesiano', 'Português'];
        const idiomasTexto = idiomasDisponibles.map((lang, index) => `🌟 ${idiomasNombres[index]}: ${usedPrefix + command} ${lang}`).join('\n');
        await m.reply(`*Seleccione el idioma para GataBot:*\n\n${idiomasTexto}`);
        return;
    }

    global.lenguajeGB = lenguajeGB;
    await m.reply(idioma.text + '\n\n*Los Comandos no cambiaran de Idioma, solo el contenido del Mensaje.*');
};

handler.command = /^(idioma|languaje|idiomas|languajes|languages|lingua)$/i;
handler.owner = true;

export default handler;
