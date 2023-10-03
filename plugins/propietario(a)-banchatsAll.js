function waitTwoMinutes() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 2 * 60 * 1000); 
  });
}
  let handler = async (m, { conn }) => {
    try {
      // Leer la base de datos
      await db.read();
    
      // Buscar y actualizar todos los isBanned: false
      const chats = db.data.chats;
      let successfulBans = 0;
    
      for (const [key, value] of Object.entries(chats)) {

        if (value.isBanned === false) {
          value.isBanned = true;
          //console.log('Baneando chat:', key);
          successfulBans++;
      }
    }
    
      // Escribir los cambios en la base de datos
      await db.write();
    
      if (successfulBans === 0) {
        try {
          
        } catch (error) {
        let resp = `${error} No se pudo banear ningún chat`.trim()
        let int = '';
        let count = 0;
        console.log (error, 'No se pudo banear ningún chat')
        for (const c of resp) {
            await new Promise(resolve => setTimeout(resolve, 50));
            int += c;
            count++;
        
            if (count % 10 === 0) {
                conn.sendPresenceUpdate('composing' , m.chat);
            }}
              await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} ) 
            throw new Error('No se pudo banear ningún chat', error);
          }
      } else {
        let resp = `Se banearon ${successfulBans} chats correctamente`.trim()
        let int = '';
        let count = 0;
        console.log(`Se banearon ${successfulBans} chats correctamente`);
        for (const c of resp) {
            await new Promise(resolve => setTimeout(resolve, 50));
            int += c;
            count++;
        
            if (count % 10 === 0) {
                conn.sendPresenceUpdate('composing' , m.chat);
            }
        }
              await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
      }
    
    } catch (e) {
      let resp = `Error: ${e.message}`.trim()
      let int = '';
      let count = 0;
      console.log(`Error: ${e.message}`);
      for (const c of resp) {
          await new Promise(resolve => setTimeout(resolve, 50));
          int += c;
          count++;
      
          if (count % 10 === 0) {
              conn.sendPresenceUpdate('composing' , m.chat);
          }
      }
            await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
    } 
    await waitTwoMinutes()         
          try {
            // Leer la base de datos
            await db.read();
          
            // Buscar y actualizar todos los isBanned: false
            const chats = db.data.chats;
            let successfulUnbans = 0;
          
            for (const [key, value] of Object.entries(chats)) {
              if (value.isBanned === true) {
                value.isBanned = false;
                //console.log('Desbaneando chat:', key);
                successfulUnbans++;
              }
            }
          
            // Escribir los cambios en la base de datos
            await db.write();
          
            if (successfulUnbans === 0) {
              try {
                
              } catch (error) {
        let resp = `No se pudo desbanear ningún chat`.trim()
        let int = '';
        let count = 0;
        for (const c of resp) {
            await new Promise(resolve => setTimeout(resolve, 50));
            int += c;
            count++;
        
            if (count % 10 === 0) {
                conn.sendPresenceUpdate('composing' , m.chat);
            }
        }
              await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
              throw new Error('No se pudo desbanear ningún chat', error);
                
              }
            } else {
        let resp = `Se desbanearon ${successfulUnbans} chats correctamente`.trim()
        let int = '';
        let count = 0;
        console.log(`Se desbanearon ${successfulUnbans} chats correctamente`);
        for (const c of resp) {
            await new Promise(resolve => setTimeout(resolve, 50));
            int += c;
            count++;
        
            if (count % 10 === 0) {
                conn.sendPresenceUpdate('composing' , m.chat);
            }
        }
              await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )
            }
          
          } catch (e) {
            let resp = `Error: ${e.message}`.trim()
            let int = '';
            let count = 0;
            console.log(`Error: ${e.message}`);
            for (const c of resp) {
                await new Promise(resolve => setTimeout(resolve, 50));
                int += c;
                count++;
            
                if (count % 10 === 0) {
                    conn.sendPresenceUpdate('composing' , m.chat);
                }
            }
                  await conn.sendMessage(m.chat, { text: int, mentions: conn.parseMention(resp) }, {quoted: m}, { disappearingMessagesInChat: 1 * 1000} )          }
          
          
  };
  handler.help = ['banchatAll']

  handler.tags = ['owner']
  
  handler.command = /^banchatall$/i
  handler.owner = true
  export default handler