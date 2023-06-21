
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({ apiKey: 
//`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`
`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`
})
let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉𝘼 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉 𝙊 𝙐𝙉𝘼 𝙊𝙍𝘿𝙀𝙉 𝙋𝘼𝙍𝘼 𝙐𝙎𝘼𝙍 𝙇𝘼 𝙁𝙐𝙉𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝘾𝙃𝘼𝙏𝙂𝙋𝙏\n\n❏ 𝙀𝙅𝙀𝙈𝙋𝙇𝙊 𝘿𝙀 𝙋𝙀𝙏𝙄𝘾𝙄𝙊𝙉𝙀𝙎 𝙔 𝙊𝙍𝘿𝙀𝙉𝙀𝙎\n❏ ${usedPrefix + command} Recomienda un top 10 de películas de acción\n❏ ${usedPrefix + command} Codigo en JS para un juego de cartas`
try {
//const configuration = new Configuration({
    apiKey: "org-HITjoN7H8pCwoncEB9e3fSyW" //api key bisa didapatkan dari https://openai.com/api/
//});
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let entrance;
let mentionedNames = {};
let int = text;

// Procesar menciones en el mensaje original
if (m.mentionedJid && m.mentionedJid && m.mentionedJid.length > 0) {
  m.mentionedJid.forEach(async (jid) => {
    let user = await conn.getName(jid);
    mentionedNames[jid] = user.pushname || user.name || jid.split('@')[0];
  });
}

// Procesar menciones en el mensaje citado
if (m.quoted && m.quoted.mentionedJid && m.quoted.mentionedJid.length > 0) {
  m.quoted.mentionedJid.forEach(async (jid) => {
    let user = await conn.getName(jid);
    mentionedNames[jid] = user.pushname || user.name || jid.split('@')[0];
  });
}

// Reemplazar menciones con nombres en el texto original
for (let jid in mentionedNames) {
  int = int.replace(new RegExp(jid.replace('@', '\\\@'), 'g'), '@' + mentionedNames[jid]);
}

// Reemplazar menciones con nombres en el mensaje citado
let quoted = m.quoted ? m.quoted.int : '';
for (let jid in mentionedNames) {
  quoted = quoted.replace(new RegExp(jid.replace('@', '\\\@'), 'g'), '@' + mentionedNames[jid]);
}

// Crear la cadena de salida
if (m.mentionedJid) {
  entrance = `Petición: ${int}\nCitado: ${quoted}\nID de Whatsapp: ${Object.keys(mentionedNames).join(', ')}\nNombre de usuario o apodo: ${Object.values(mentionedNames).join(', ')}`;
} else {
  entrance = int;
}

console.log(entrance);


const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: entrance,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        });
        const resp = response.data.choices[0].text
        let txt = '';
        let count = 0;
        for (const c of resp) {
            await new Promise(resolve => setTimeout(resolve, 50));
            txt += c;
            count++;
        
            if (count % 10 === 0) {
                conn.sendPresenceUpdate('composing' , m.chat);
            }
        }
    await conn.sendMessage(m.chat, { text: txt.trim(), mentions: conn.parseMention(txt) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} );
} catch {        
throw `${lenguajeGB['smsAvisoFG']()}𝙀𝙍𝙍𝙊𝙍, 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍𝙇𝙊*`
}}
handler.command = ['openai', 'chatgpt', 'ia', 'robot']
export default handler

//