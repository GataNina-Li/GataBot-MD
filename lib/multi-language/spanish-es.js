const MID_GB = {
idioma: 'Español',
idioma_code: 'es',
  
//main.js
methodCode1: 'MÉTODO DE VINCULACIÓN',
methodCode2: '¿CÓMO DESEA CONECTARSE?',
methodCode3: 'Opción',
methodCode4: 'Código QR',
methodCode5: 'Código de 8 digitos.',
methodCode6: 'Escriba sólo el número de',
methodCode7: 'la opción para conectarse.',
methodCode8: 'CONSEJO',
methodCode9: 'Si usa Termux, Replit, Linux, o Windows',
methodCode10: 'Use estos comandos para una ejecución directa:',
methodCode11: (chalk) => `NO SE PERMITE NÚMEROS QUE NO SEAN ${chalk.bold.greenBright("1")} O ${chalk.bold.greenBright("2")}, TAMPOCO LETRAS O SÍMBOLOS ESPECIALES.\n${chalk.bold.yellowBright("CONSEJO: COPIE EL NÚMERO DE LA OPCIÓN Y PÉGUELO EN LA CONSOLA.")}`,
methodCode12: 'Inicia con código QR',
methodCode13: 'Inicia con código de 8 dígitos',
methodCode14: 'Inicio predeterminado con opciones',
phNumber2: (chalk) => `Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright("CONSEJO: Copie el número de WhatsApp y péguelo en la consola.")}\n${chalk.bold.yellowBright("Ejemplo: +593090909090")}\n${chalk.bold.magentaBright('---> ')}`,
pairingCode: 'CÓDIGO DE VINCULACIÓN:',
mCodigoQR: `\n✅ ESCANEA EL CÓDIGO QR EXPIRA EN 45 SEGUNDOS`,
mConexion: `\n❒⸺⸺⸺⸺【• CONECTADO •】⸺⸺⸺⸺❒\n│\n│ 🟢 Se ha conectado con WhatsApp exitosamente.\n│\n❒⸺⸺⸺⸺【• CONECTADO •】⸺⸺⸺⸺❒`,
mConexionOFF: "\n❌𒌍 CONEXION REPLAZADA, POR FAVOR ESPERE UN MOMENTO ME VOY A REINICIAR...\nSI SALE ERROR VUELVE A INICIAR CON: npm start", 

//Alertas
mAdminTrue: '*Eres Admin. no habrá consecuencias* 🤭',
mAdmin: '*Debo de ser Admin. para poder eliminar*',
mOwner: '*Si tienes permisos o eres propietario/a, usa `#on restringir`*\n\n> _Si lo activas, las funciones no se limitarán_',
mAntiDelete: '*Desactive la función anti eliminar usando `#off antieliminar` para evitar reenvío de mensajes no deseados*',
mAdvertencia: '> ⚠️ *ADVERTENCIA 𓃠*\n\n',
mInfo: '> 📢 *INFORMACIÓN 𓃠*\n\n',
mExito: '> ✅ *ÉXITO 𓃠*\n\n',
mError: '> ❌ *ERROR 𓃠*\n\n',

//_allantilink.js
mTiktok: '*¡No se permite enlace de TikTok!*\n*Procedo a eliminarte*',
mYoutube: '*¡No se permite enlace de YouTube!*\n*Procedo a eliminarte*',
mTelegram: '*¡No se permite enlace de Telegram!*\n*Procedo a eliminarte*',
mFacebook: '*¡No se permite enlace de Facebook!*\n*Procedo a eliminarte*',
mInstagram: '*¡No se permite enlace de Instagram!*\n*Procedo a eliminarte*',
mX: '*¡No se permite enlace de X (Twitter)!*\n*Procedo a eliminarte*',
mDiscord: '*¡No se permite enlace de Discord!*\n*Procedo a eliminarte*',
mThreads: '*¡No se permite enlace de Threads!*\n*Procedo a eliminarte*',
mTwitch: '*¡No se permite enlace de Twitch!*\n*Procedo a eliminarte*',

//_antilink.js
mWhatsApp: '*¡No se permite este tipo de enlace de WhatsApp!*\n*Procedo a eliminarte*',

//_antilink2.js
mWhatsApp2: '*¡No se permite ningún tipo de enlace!*\n*Procedo a eliminarte*',
  
//antiprivado.js
smsprivado: (m, cuentas) => `*@${m.sender.split`@`[0]} Esta prohibido escribir al privado*\n\n> *Únete a la comunidad GataBot para conocer cómo puedes tener tú propio Bot para WhatsApp*\n${cuentas}\n\n⚠️ \`\`\`Serás Bloqueado(a)\`\`\` ⚠️`, 

//_anti-internacional.js
mFake: (m) => `✋ *¡El usuario @${m.sender.split`@`[0]} no esta permitido en este grupo!*`, 
mFake2: (user) => `🚫 *¡El usuario @${user.split`@`[0]} no es bienvenido en este grupo!*`, 
  
//antispam.js
smsNoSpam: "SPAM DE MENSAJES LEVE", 
smsNoSpam1: (m, motive) => `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 30 SEGUNDOS*\n\n*MOTIVO: ${motive}*`, 
smsNoSpam2: "SPAM DE MENSAJES MODERADO", 
smsNoSpam3: (m, motive) => `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 1 MINUTO*\n\n*MOTIVO: ${motive}*`, 
smsNoSpam4: "SPAM DE MENSAJES ALARMANTE", 
smsNoSpam5: (m, motive) => `*@${m.sender.split`@`[0]} NO PUEDE USAR COMMANDOS DURANTE 2 MINUTOS*\n\n*MOTIVO: ${motive}*`, 
smsNoSpam6: (mention, sender) => `*${mention} ESTA PROHIBIDO HACER SPAM DE MENSAJES!!*`, 

//antitraba.js
smsAntiTraba: (m) => `El administrador @${m.sender.split("@")[0]} acaba de enviar un texto que contiene muchos caracteres -.-!`, 
smsAntiTraba2: '[ ! ] Se detecto un mensaje que contiene muchos caracteres [ ! ]', 
smsAntiTraba3: 'Marcar el chat como leido ✓', 
smsAntiTraba4: (m, name) => `El número : wa.me/${m.sender.split("@")[0]}\n• Alias : ${name}\n‼️Acaba de enviar un texto que contiene muchos caracteres que puede ocasionar fallos en los dispositivos`, 

//_autodetec.js
smsAutodetec1: (usuario, m) => `*» ${usuario}*\n*𝙃𝘼 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊*\n\n🔰 *𝘼𝙃𝙊𝙍𝘼 𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 𝙎𝙀 𝙇𝙇𝘼𝙈𝘼:*\n*${m.messageStubParameters[0]}*`, 
smsAutodetec2: (usuario, groupMetadata) => `*» ${usuario}*\n*𝙃𝘼 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙇𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝘿𝙀:*\n*${groupMetadata.subject}*`, 
smsAutodetec3: (usuario, m) => `*» ${usuario}*\n*𝙃𝘼 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙇𝘼 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊́𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊\n🔰 *𝙉𝙐𝙀𝙑𝘼 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊́𝙉 𝙀𝙎:*`, 
smsAutodetec4: (usuario, m, groupMetadata) => `🔒 ${usuario}*\n*𝙃𝘼 𝙋𝙀𝙍𝙈𝙄𝙏𝙄𝘿𝙊 𝙌𝙐𝙀 ${m.messageStubParameters[0] == 'on' ? '𝙎𝙊𝙇𝙊 𝘼𝘿𝙈𝙄𝙉𝙎' : '𝙏𝙊𝘿𝙊𝙎'} 𝙋𝙐𝙀𝘿𝘼𝙉 𝘾𝙊𝙉𝙁𝙄𝙂𝙐𝙍𝘼𝙍 ${groupMetadata.subject}*`, 
smsAutodetec5: (groupMetadata, usuario) => `*𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 ${groupMetadata.subject} 𝙃𝘼 𝙎𝙄𝘿𝙊 𝙍𝙀𝙎𝙏𝘼𝘽𝙇𝙀𝘾𝙄𝘿𝙊 𝙋𝙊𝙍:*\n*» ${usuario}*`, 
smsAutodetec6: (m) => `𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 *${m.messageStubParameters[0] == 'on' ? '𝙀𝙎𝙏𝘼 𝘾𝙀𝙍𝙍𝘼𝘿𝙊 🔒' : '𝙀𝙎𝙏𝘼 𝘼𝘽𝙄𝙀𝙍𝙏𝙊 🔓'}*\n ${m.messageStubParameters[0] == 'on' ? '𝙎𝙊𝙇𝙊 𝙇𝙊𝙎 𝘼𝘿𝙈𝙄𝙉𝙎 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍' : '𝙔𝘼 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙏𝙊𝘿𝙊𝙎'} 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊*`, 
smsAutodetec7: (m, usuario) =>  `@${m.messageStubParameters[0].split`@`[0]} 𝘼𝙃𝙊𝙍𝘼 𝙀𝙎 𝘼𝘿𝙈𝙄𝙉 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊\n\n😼🫵𝘼𝘾𝘾𝙄𝙊𝙉 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝘿𝘼 𝙋𝙊𝙍: ${usuario}`, 
smsAutodetec8: (m,  usuario) => `@${m.messageStubParameters[0].split`@`[0]} 𝘿𝙀𝙅𝘼 𝘿𝙀 𝙎𝙀𝙍 𝘼𝘿𝙈𝙄𝙉 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊\n\n😼🫵𝘼𝘾𝘾𝙄𝙊𝙉 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝘿𝘼 𝙋𝙊𝙍: ${usuario}`, 
smsAutodetec9: (usuario, m) => `*» ${usuario}*\n*𝙃𝘼 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙇𝘼𝙎 𝘿𝙐𝙍𝘼𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙇𝙊𝙎 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇𝙀𝙎 𝘼 : *@${m.messageStubParameters[0]}*`, 
smsAutodetec10: (usuario, m) => `*» ${usuario}*\n𝙃𝘼 *𝘿𝙀𝙎𝘼𝘾𝙏𝙄𝙑𝙊* 𝙇𝙊𝙎 𝙈𝙀𝙉𝙎𝘼𝙅𝙀 𝙏𝙀𝙈𝙋𝙊𝙍𝘼𝙇`, 

//_antitoxic.js
antitoxic1: (isToxic, m, user) => `☣️ *PALABRA PROHIBIDA* ☣️\n\n*@${m.sender.split`@`[0]}* La palabra \`(${isToxic})\` esta prohibida en este grupo!!\n\n⚠️ *Advertencias:* \`${user.warn}/4\`\n\n> Si tienes 4 o más advertencias serás eliminado/a del grupo`, 
antitoxic2: (isToxic, m) => `☣️ *PALABRA PROHIBIDA* ☣️\n\n*@${m.sender.split`@`[0]}* Serás eliminado/a por decir \`(${isToxic})\`, eres tóxico/a en el grupo!! 🚷`, 

//_antiviewonce.js
antiviewonce: (type, fileSize, m, msg) => `🕵️‍♀️ *ANTI VER UNA VEZ* 🕵️\n
🚫 *No ocultar* ${type === 'imageMessage' ? '`Imagen` 📷' : type === 'videoMessage' ? '`Vídeo` 🎥' : type === 'audioMessage' ? '`Mensaje de voz` 🔊' : 'este mensaje'}
- *Tamaño:* \`\`\`${fileSize}\`\`\`
- *Usuario:* *@${m.sender.split('@')[0]}*
${msg[type].caption ? `- *Texto:* ${msg[type].caption}` : ''}`.trim(), 
  
//información
smsinfo: "💖 *Infórmate sobre las Novedades y recuerda tener la última versión.*", 
name: "𝙉𝙊𝙈𝘽𝙍𝙀", 
user: "𝙐𝙎𝙐𝘼𝙍𝙄𝙊(𝘼)", 

//Descargar 
smsYT1: "𝙏𝙄𝙏𝙐𝙇𝙊", 
smsYT2: "𝘼𝙐𝙏𝙊𝙍(𝘼)", 
smsYT3: "𝙇𝙀𝙏𝙍𝘼", 
smsYT4: "𝙀𝙉𝙇𝘼𝘾𝙀:", 
smsYT5: "𝘿𝙐𝙍𝘼𝘾𝙄𝙊́𝙉:", 
smsYT6: "𝘼𝙍𝙏𝙄𝙎𝙏𝘼", 
smsYT7: "𝘼́𝙇𝘽𝙐𝙈", 
smsYT8: "𝙁𝙀𝘾𝙃𝘼", 
smsYT9: "𝙂𝙀𝙉𝙀𝙍𝙊𝙎", 
smsYT9: "𝙎𝙐𝘽𝙄𝘿𝙊", 
smsYT10: "𝙑𝙄𝙎𝙏𝘼𝙎", 
smsYT11: "𝙋𝙀𝙎𝙊", 
smsYT12: "𝙏𝙄𝙋𝙊", 
smsYT13: "𝘼𝙍𝙏𝙄𝙎𝙏𝘼", 
smsYT14: "𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉", 
smsYT15: "𝙋𝙐𝘽𝙇𝙄𝘾𝘼𝘿𝙊", 
smsinsta1: "𝙎𝙀𝙂𝙐𝙄𝘿𝙊𝙍𝙀𝙎", 
smsinsta2: "𝙎𝙀𝙂𝙐𝙄𝘿𝙊𝙎", 
smsinsta3: "𝙋𝙐𝘽𝙇𝙄𝘾𝘼𝘾𝙄𝙊𝙉𝙀𝙎", 
smsinsta4: "𝘽𝙄𝙊𝙂𝙍𝘼𝙁Í𝘼", 
smsinsta5: "𝙈𝙀 𝙂𝙐𝙎𝙏𝘼", 

//descarga
smsYtlist: (usedPrefix) => `𝙋𝙐𝙀𝘿𝙀𝙎 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝘼𝙎 𝘿𝙀 𝙀𝙎𝙏𝘼 𝙁𝙊𝙍𝙈𝘼:\n${usedPrefix}video <numero>\n${usedPrefix}audio <numero>\n\n*𝙀𝙅𝙀𝙈𝙋𝙇𝙊:*`, 
smsfb: '𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆', 
smsfb2: '𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊, 𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆', 
smsfb3: '𝘼𝙇𝙂𝙊 𝙎𝘼𝙇𝙄𝙊 𝙈𝘼𝙇, 𝙍𝙀𝘾𝙐𝙀𝙍𝘿𝙀 𝙐𝙎𝘼𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙑𝘼𝙇𝙄𝘿𝙊 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆', 
smsgit: '𝙀𝙉𝙇𝘼𝘾𝙀 𝙉𝙊 𝙑𝘼𝙇𝙄𝘿𝙊. 𝘿𝙀𝘽𝙀 𝘿𝙀 𝙎𝙀𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙂𝙄𝙏𝙃𝙐𝘽', 
smsgit2: '𝙀𝙉𝙑𝙄𝘼𝙉𝘿𝙊 𝘼𝙍𝘾𝙃𝙄𝙑𝙊, 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 🚀\n𝙎𝙄 𝙉𝙊 𝙇𝙀 𝙇𝙇𝙀𝙂𝘼 𝙀𝙇 𝘼𝙍𝘾𝙃𝙄𝙑𝙊 𝙀𝙎 𝘿𝙀𝘽𝙄𝘿𝙊 𝘼 𝙌𝙐𝙀 𝙀𝙇 𝙍𝙀𝙋𝙊𝙎𝙄𝙏𝙊𝙍𝙄𝙊 𝙀𝙎 𝙋𝙀𝙎𝘼𝘿𝙊. 🚀', 
smsInsta: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙄𝙉𝙎𝙏𝘼𝙂𝙍𝘼𝙈 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊 𝙊 𝙄𝙈𝘼𝙂𝙀𝙉\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsInsta2: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝘿𝙀 𝙄𝙉𝙎𝙏𝘼𝙂𝙍𝘼𝙈 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙇𝘼𝙎 𝙃𝙄𝙎𝙏𝙊𝙍𝙄𝘼𝙎\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsInsta3: '𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝙄𝙉𝙑𝘼́𝙇𝙄𝘿𝙊𝙎 𝙊 𝙎𝙄𝙉 𝙃𝙄𝙎𝙏𝙊𝙍𝙄𝘼𝙎', 
smsFire: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙑𝘼𝙇𝙄𝘿𝙊 𝘿𝙀 𝙈𝙀𝘿𝙄𝘼𝙁𝙄𝙍𝙀.', 
smsApk: '*ESCRIBA EL NOMBRE DEL APK*', 
smsApk2: '𝙐𝙇𝙏𝙄𝙈𝘼 𝘼𝘾𝙏𝙐𝙇𝙄𝙕𝘼𝘾𝙄𝙊𝙉', 
smsApk3: '𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝘿𝙊 𝘼𝙋𝙆𝙎', 
smsApk4: 'EL APK ES MUY PESADO.', 
smsTikTok: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙎𝙄𝙉 𝙐𝙎𝘼𝙍 (@)\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsTikTok1: '𝙁𝙊𝙏𝙊 𝘿𝙀 𝙋𝙀𝙍𝙁𝙄𝙇', 
smsTikTok2: '𝘿𝙀𝘽𝙀 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝙍 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsTikTok3: '𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙀𝙎 𝙄𝙉𝘾𝙊𝙍𝙍𝙀𝘾𝙏𝙊, 𝙋𝙍𝙊𝘾𝙐𝙍𝙀 𝙌𝙐𝙀 𝙀𝙎𝙏𝙀 𝙑𝘼𝙇𝙄𝘿𝙊', 
smsTikTok4: '𝙋𝙍𝙊𝙉𝙏𝙊 𝙏𝙀𝙉𝘿𝙍𝘼 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 😸', 
smsTikTok5: (anu) => `*Se ha enviado 1 de ${anu.length} imágenes.* ✅\n_El resto podrá ser visible en el chat privado del bot_ 😸`, 
smsTikTok6: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙎𝙐𝘼𝙍𝙄𝙊 𝘿𝙀 𝙏𝙄𝙆𝙏𝙊𝙆 𝙎𝙄𝙉 𝙐𝙎𝘼𝙍 (@)\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsSpoti: 'Enviando canción...', 
smsAguarde: (additionalText) => `𝙀𝙉𝙑𝙄𝘼𝘿𝙊 ${additionalText}, 𝘼𝙂𝙐𝘼𝙍𝘿𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊`, 
smsAud: '𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝘼𝙐𝘿𝙄𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍', 
smsVid: '𝙎𝙀 𝙀𝙎𝙏𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙉𝘿𝙊 𝙎𝙐 𝙑𝙄𝘿𝙀𝙊, 𝙀𝙎𝙋𝙀𝙍𝙀 𝙐𝙉 𝙈𝙊𝙈𝙀𝙉𝙏𝙊 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍',
smsYT: '𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊́ 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀𝙎 𝙋𝘼𝙍𝘼 𝙀𝙎𝙀 𝙉𝙐́𝙈𝙀𝙍𝙊, 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙉𝙐́𝙈𝙀𝙍𝙊 𝙀𝙉𝙏𝙍𝙀 1 𝙔 𝙀𝙇', 
smsY2: (usedPrefix, command) => `𝙋𝘼𝙍𝘼 𝙋𝙊𝘿𝙀𝙍 𝙐𝙎𝘼𝙍 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝘿𝙀 𝙀𝙎𝙏𝘼 𝙁𝙊𝙍𝙈𝘼 (${usedPrefix + command} <numero>), 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝙍𝙀𝘼𝙇𝙄𝙕𝘼𝙍 𝙇𝘼 𝘽𝙐́𝙎𝙌𝙐𝙀𝘿𝘼 𝘿𝙀 𝙑𝙄́𝘿𝙀𝙊𝙎 𝘾𝙊𝙉 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊`, 

//ejemplos
smsMalused: "𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙇𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝙀 𝘽𝙐𝙎𝘾𝘼𝙍\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n", 
smsMalused2: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉 𝘼𝙉𝙄𝙈𝙀', 
smsMalused3: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉𝘼 𝘾𝘼𝙉𝘾𝙄𝙊𝙉 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙇𝘼 𝙇𝙀𝙏𝙍𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsMalused4: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉 𝙑𝙄𝘿𝙀𝙊 𝙊 𝘾𝘼𝙉𝘼𝙇 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀', 
smsMalused4: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝙊 𝙏𝙄𝙏𝙐𝙇𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsMalused5: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙁𝘼𝘾𝙀𝘽𝙊𝙊𝙆 𝙋𝘼𝙍𝘼 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsMalused6: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙂𝙄𝙏𝙃𝙐𝘽\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsMalused7: '⚡ *USAR EL COMANDO DE ESTA FORMA:*\n', 
smsMalused8: `🐈 *DEBE DE USAR EL COMANDO COMO EN ESTE EJEMPLO:*\n`, 
smsMalused9: `🐈 *RESPONDE A UN MENSAJE CON EL COMANDO O USE ESTE EJEMPLO:*\n`, 

//Error
smsMalError: `\`\`\`OCURRIÓ UN ERROR INESPERADO.\`\`\``, 
smsMalError2: `\`\`\`SURGIÓ UN INCONVENIENTE.\`\`\`\n`, 
smsMalError3: `\`\`\`ALGO SALIÓ MAL, REPORTE ESTE COMANDO USANDO:\`\`\`\n`, 

//grupos
smsAdd: 'Hola! me presento, soy GataBot-MD 🐈, soy un Bot de WhatsApp, una persona del grupo utilizo el comando para añadirte al grupo, pero no pude agregarte, asi que te mando la invitacion para que te unas al grupo, te esperamos con ansias!!', 
smsAdd2: 'Enviando invitacion a su privado...', 
smsGrup: '𝙔𝘼 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙏𝙊𝘿𝙊𝙎 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊!!', 
smaGrup2: '𝙎𝙊𝙇𝙊 𝙇𝙊𝙎 𝘼𝘿𝙈𝙄𝙉𝙎 𝙋𝙐𝙀𝘿𝙀𝙉 𝙀𝙎𝘾𝙍𝙄𝘽𝙄𝙍 𝙀𝙉 𝙀𝙎𝙏𝙀 𝙂𝙍𝙐𝙋𝙊!!', 

//buscadores
buscador: "*RESULTADOS DE:* ", 
buscador2: "𝙀𝙋𝙄𝙎𝙊𝘿𝙄𝙊𝙎:", 
buscador3: "𝙁𝙊𝙍𝙈𝘼𝙏𝙊:", 
buscador3: "𝘽𝘼𝙎𝘼𝘿𝙊 𝙀𝙉:", 
buscador4: "𝙀𝙎𝙏𝙍𝙀𝙉𝘼𝘿𝙊:", 
buscador5: "𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎:", 
buscador6: "𝙁𝘼𝙑𝙊𝙍𝙄𝙏𝙊𝙎:", 
buscador7: "𝘾𝙇𝘼𝙎𝙄𝙁𝙄𝘾𝘼𝘾𝙄𝙊𝙉:", 
buscador8: "𝙏𝙍𝘼𝙄𝙇𝙀𝙍:", 
buscador9: "*🔎 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙀 𝙀𝙎𝙏𝙊:*", 
buscador10: "𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊 𝙉𝙄𝙉𝙂𝙐𝙉𝘼 𝙋𝙀𝙇𝙄𝘾𝙐𝙇𝘼", 
buscador11: "𝘽𝙇𝙊𝙌𝙐𝙀𝘼𝘿𝙊𝙍 𝘿𝙀 𝘼𝙉𝙐𝙉𝘾𝙄𝙊𝙎 𝙍𝙀𝘾𝙊𝙈𝙀𝙉𝘿𝘼𝘿𝙊", 

//convertido
smsconvert: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝙊 𝙀𝙏𝙄𝙌𝙐𝙀𝙏𝙀 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉", 
smsconvert1: "𝘼𝙂𝙐𝘼𝙍𝘿𝙀 𝙀𝙎𝙏𝙊𝙔 𝘾𝙊𝙉𝙑𝙄𝙍𝙏𝙄𝙀𝙉𝘿𝙊 𝙇𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝘼 𝘿𝙄𝙎𝙀𝙉̃𝙊 𝘼𝙉𝙄𝙈𝙀, 𝙎𝙀𝘼 𝙋𝘼𝘾𝙄𝙀𝙉𝙏𝙀 𝙀𝙉 𝙇𝙊 𝙌𝙐𝙀 𝙀𝙉𝙑𝙄𝙊 𝙀𝙇 𝙍𝙀𝙎𝙐𝙇𝙏𝘼𝘿𝙊", 
smsconvert2: "𝙀𝙍𝙍𝙊𝙍, 𝙑𝙀𝙍𝙄𝙁𝙄𝙌𝙐𝙀 𝙌𝙐𝙀 𝙇𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙎𝙀𝘼 𝙀𝙇 𝙍𝙊𝙎𝙏𝙍𝙊 𝘿𝙀 𝙐𝙉𝘼 𝙋𝙀𝙍𝙎𝙊𝙉𝘼", 
smsconvert3: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀𝙍 𝘼 𝙐𝙉 𝙎𝙏𝙄𝘾𝙆𝙀𝙍 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝙀𝙉 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉, 𝙐𝙎𝙀 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊", 
smsconvert4: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘼 𝙐𝙉 𝙑𝙄𝘿𝙀𝙊 𝙊 𝙉𝙊𝙏𝘼 𝘿𝙀 𝙑𝙊𝙕 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝙀𝙉 𝘼𝙐𝘿𝙄𝙊|𝙈𝙋3", 
smsconvert5: "𝙉𝙊 𝙎𝙀 𝙇𝙊𝙂𝙍𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊, 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝙉𝙐𝙀𝙑𝘼𝙈𝙀𝙉𝙏𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍", 
smsconvert6: "𝙉𝙊 𝙎𝙀 𝙇𝙊𝙂𝙍𝙊 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝙎𝙐 𝙉𝙊𝙏𝘼 𝘿𝙀 𝙑𝙊𝙕 𝘼 𝘼𝙐𝘿𝙄𝙊|𝙈𝙋3 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝙉𝙐𝙀𝙑𝘼𝙈𝙀𝙉𝙏𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍", 
smsconvert7: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀𝙍 𝘼 𝙐𝙉 𝙑𝙄𝘿𝙀𝙊 𝙊 𝘼𝙐𝘿𝙄𝙊 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝘼 𝙉𝙊𝙏𝘼 𝘿𝙀 𝙑𝙊𝙕", 
smsconvert8: "𝙉𝙊 𝙎𝙀 𝙇𝙊𝙂𝙍𝙊 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙍 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊, 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝙉𝙐𝙀𝙑𝘼𝙈𝙀𝙉𝙏𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍", 
smsconvert9: "𝙉𝙊 𝙎𝙀 𝙇𝙊𝙂𝙍𝙊 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝘿𝙀 𝘼𝙐𝘿𝙄𝙊 𝘼 𝙉𝙊𝙏𝘼 𝘿𝙀 𝙑𝙊𝙕, 𝙄𝙉𝙏𝙀𝙉𝙏𝙀 𝙉𝙐𝙀𝙑𝘼𝙈𝙀𝙉𝙏𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍", 
smsconvert10: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘼 𝙐𝙉𝘼 𝙄𝙈𝘼𝙂𝙀𝙉 𝙊 𝙑𝙄𝘿𝙀𝙊", 
smsconvert11: "𝙏𝘼𝙈𝘼𝙉𝙊", 
smsconvert12: "𝙀𝙓𝙋𝙄𝙍𝘼𝘾𝙄𝙊𝙉", 
smsconvert13: "𝘼𝘾𝙊𝙍𝙏𝘼𝘿𝙊", 
smsconvert14: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝙀𝙍 𝘼𝙇 𝘼𝙐𝘿𝙄𝙊 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝙀𝙉 𝙑𝙄𝘿𝙀𝙊", 
smsconvert15: "𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙐𝙉 𝙏𝙀𝙓𝙏𝙊 𝙋𝘼𝙍𝘼 𝘾𝙊𝙉𝙑𝙀𝙍𝙏𝙄𝙍 𝘼 𝙉𝙊𝙏𝘼 𝘿𝙀 𝙑𝙊𝙕\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊", 
smsconvert16: "𝙍𝙀𝙎𝙋𝙊𝙉𝘿𝘼 𝘼𝙇 𝘼𝙐𝘿𝙄𝙊 𝙊 𝙉𝙊𝙏𝘼 𝘿𝙀 𝙑𝙊𝙕 𝙋𝘼𝙍𝘼 𝙈𝙊𝘿𝙄𝙁𝙄𝘾𝘼𝙍𝙇𝙊 𝙐𝙎𝙀 𝙀𝙎𝙏𝙀 𝘾𝙊𝙈𝘼𝙉𝘿𝙊", 

//herramientas.js
smsAcorta: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙋𝘼𝙍𝘼 𝘼𝘾𝙊𝙍𝙏𝘼𝙍', 
smsAcorta2: (text) => `✅ 𝙎𝙀 𝙍𝙀𝘼𝙇𝙄𝙕𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊\n\n𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝘼𝙉𝙏𝙀𝙎\n*${text}*\n\n𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝘼𝙃𝙊𝙍𝘼`, 

//comando +18
smshorny: "𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙑𝘼𝙇𝙄𝘿𝙊 𝘿𝙀 𝙓𝙉𝙓𝙓, 𝙀𝙅𝙀𝙈𝙋𝙇𝙊:", 
smshorny2: "➤ 𝙀𝙎𝙋𝙀𝙍𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝘼 𝙌𝙐𝙀 𝙎𝙀 𝙀𝙉𝙑𝙄𝙀 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊"
}

export default MID_GB
