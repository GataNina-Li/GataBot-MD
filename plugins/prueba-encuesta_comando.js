/*let handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {	

//conn.sendPoll(m.chat, texto, a, {mentions: m})
await conn.sendPoll(m.chat, `Selecciona una opción:`, [usedPrefix + 'menu', usedPrefix + 'estado', usedPrefix + 'ping'], { mentions: m })
}
handler.command = ['pruebapoll'] 
export default handler*/

const handler = async (m, { conn, text, args, participants, usedPrefix, command }) => {
 let sock = conn
    const prefix = usedPrefix

    async function getMessage(key) {
        if (store) {
            const msg = await store.loadMessage(key.remoteJid, key.id);
            return msg?.message;
        }
        return { conversation: "hola" };
    }

    
    sock.ev.on('messages.update', async chatUpdate => {
        for (const { key, update } of chatUpdate) {
            if (update.pollUpdates && key.fromMe) {
                const pollCreation = await getMessage(key);
                if (pollCreation) {
                    const pollUpdate = await getAggregateVotesInPollMessage({ message: pollCreation, pollUpdates: update.pollUpdates });
                    var toCmd = pollUpdate.filter(v => v.voters.length !== 0)[0]?.name;
                    if (toCmd == undefined) return;
                    var prefCmd = prefix + toCmd;
                    sock.appenTextMessage(prefCmd, chatUpdate);
                }
            }
        }
    });

    
    conn.sendPoll = async (jid, name = '', optiPoll, selectableCount = 1) => {
        if (!Array.isArray(optiPoll[0]) && typeof optiPoll[0] === 'string') optiPoll = [optiPoll];
        const values = optiPoll.map(btn => ({
            optionName: !nullish(btn[0]) ? btn[0] : ''
        }));
        await conn.sendMessage(jid, { poll: { name, values, selectableCount }});
    };

    
    const jid = m.chat
    const pregunta = "Selecciona una opción:"
    const opciones = [["menu"], ["estado"], ["ping"]]

    try {
        await conn.sendPoll(jid, pregunta, opciones);
        console.log("Encuesta enviada correctamente.")
    } catch (error) {
        console.error("Error al enviar la encuesta:", error)
    }
}

handler.command = ['pruebapoll']
export default handler

