const MID_GB = {
idioma: 'Español',

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
phNumber: (chalk) => `Configurar archivo ${chalk.bold.greenBright("config.js")} el número ingresado no tiene código de país. ${chalk.bold.yellowBright("Ejemplo: +593090909090")}`,
phNumber2: (chalk) => `Por favor, Ingrese el número de WhatsApp.\n${chalk.bold.yellowBright("CONSEJO: Copie el número de WhatsApp y péguelo en la consola.")}\n${chalk.bold.yellowBright("Ejemplo: +593090909090")}\n${chalk.bold.magentaBright('---> ')}`,
phNumber3: "Asegúrese de agregar el código de país.",
pairingCode: 'CÓDIGO DE VINCULACIÓN:',
mCodigoQR: `\n✅ ESCANEA EL CÓDIGO QR EXPIRA EN 45 SEGUNDOS`,
mConexion: `\n❒⸺⸺⸺⸺【• CONECTADO •】⸺⸺⸺⸺❒\n│\n│ 🟢 Se ha conectado con WhatsApp exitosamente.\n│\n❒⸺⸺⸺⸺【• CONECTADO •】⸺⸺⸺⸺❒`,
mConexionOFF: "\n❌𒌍 CONEXION REPLAZADA, POR FAVOR ESPERE UN MOMENTO ME VOY A REINICIAR...\nSI SALE ERROR VUELVE A INICIAR CON: npm start", 

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

//descarga
smsYtlist: (usedPrefix) => `𝙋𝙐𝙀𝘿𝙀𝙎 𝘿𝙀𝙎𝘾𝘼𝙍𝙂𝘼𝙎 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝘼𝙎 𝘿𝙀 𝙀𝙎𝙏𝘼 𝙁𝙊𝙍𝙈𝘼:\n${usedPrefix}video <numero>\n${usedPrefix}audio <numero>\n\n*𝙀𝙅𝙀𝙈𝙋𝙇𝙊:*`, 

//ejemplos
smsMalused: "𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙇𝙊 𝙌𝙐𝙀 𝙌𝙐𝙄𝙀𝙍𝙀 𝘽𝙐𝙎𝘾𝘼𝙍\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊\n", 
smsMalused2: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉 𝘼𝙉𝙄𝙈𝙀', 
smsMalused3: '𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉𝘼 𝘾𝘼𝙉𝘾𝙄𝙊𝙉 𝙋𝘼𝙍𝘼 𝙊𝘽𝙏𝙀𝙉𝙀𝙍 𝙇𝘼 𝙇𝙀𝙏𝙍𝘼\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊', 
smsMalused4: '𝙀𝙎𝘾𝙍𝙄𝘽𝘼 𝙀𝙇 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀 𝙐𝙉 𝙑𝙄𝘿𝙀𝙊 𝙊 𝘾𝘼𝙉𝘼𝙇 𝘿𝙀 𝙔𝙊𝙐𝙏𝙐𝘽𝙀', 

//error
smsMalError: "𝙉𝙊 𝙎𝙀 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙊 𝙇𝙊 𝙌𝙐𝙀 𝘽𝙐𝙎𝘾𝘼. 𝙋𝙍𝙊𝘾𝙐𝙍𝙀 𝙐𝙎𝘼𝙍 𝙐𝙉𝘼 𝙋𝘼𝙇𝘼𝘽𝙍𝘼 𝘾𝙇𝘼𝙑𝙀", 

//buscadores
buscador: "*🔍 RESULTADOS DE:* ", 
buscador2: "𝙀𝙋𝙄𝙎𝙊𝘿𝙄𝙊𝙎:", 
buscador3: "𝙁𝙊𝙍𝙈𝘼𝙏𝙊:", 
buscador3: "𝘽𝘼𝙎𝘼𝘿𝙊 𝙀𝙉:", 
buscador4: "𝙀𝙎𝙏𝙍𝙀𝙉𝘼𝘿𝙊:", 
buscador5: "𝙈𝙄𝙀𝙈𝘽𝙍𝙊𝙎:", 
buscador6: "𝙁𝘼𝙑𝙊𝙍𝙄𝙏𝙊𝙎:", 
buscador7: "𝘾𝙇𝘼𝙎𝙄𝙁𝙄𝘾𝘼𝘾𝙄𝙊𝙉:", 
buscador8: "𝙏𝙍𝘼𝙄𝙇𝙀𝙍:", 
buscador9: "*🔎 𝙀𝙉𝘾𝙊𝙉𝙏𝙍𝙀 𝙀𝙎𝙏𝙊:*", 

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

//comando +18
smshorny: "𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝙑𝘼𝙇𝙄𝘿𝙊 𝘿𝙀 𝙓𝙉𝙓𝙓, 𝙀𝙅𝙀𝙈𝙋𝙇𝙊:", 
smshorny2: "➤ 𝙀𝙎𝙋𝙀𝙍𝙀 𝙋𝙊𝙍 𝙁𝘼𝙑𝙊𝙍 𝘼 𝙌𝙐𝙀 𝙎𝙀 𝙀𝙉𝙑𝙄𝙀 𝙀𝙇 𝙑𝙄𝘿𝙀𝙊", 
smshorny3: "𝙉𝙊 𝙁𝙐𝙉𝘾𝙄𝙊𝙉𝙊, 𝙐𝙎𝙀 𝙐𝙉 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀 𝙓𝙉𝙓𝙓, 𝙑𝙐𝙀𝙇𝙑𝘼 𝘼 𝙄𝙉𝙏𝙀𝙉𝙏𝘼𝙍"
}

export default MID_GB
