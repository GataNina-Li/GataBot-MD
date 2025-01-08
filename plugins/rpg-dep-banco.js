const handler = async (m, {conn, command, args}) => {
let who;
if (m.isGroup) who = m.mentionedJid[0] ? m.mentionedJid[0] : m.sender;
else who = m.sender;
let users =  global.db.data.users[m.sender];

if (command == 'dep' || command == 'depositar') {  
if (!args[0]) return m.reply(`*💎 INGRESA LA CANTIDAD PARA AGREGAR A SUS CUENTAS  BANCARIA*`);
if (args[0] == '--all') {
let count = parseInt(users.limit);
users.limit -= count * 1
users.banco += count * 1
await m.reply(`*[ 🏦 ] HAS AGREGADOS.*`);
return !0;
};
if (!Number(args[0])) return m.reply(`[ ⚠️ ] *FALTO EN NÚMERO DE CANTIDAD DE DIAMANTE 💎*`);
let count = parseInt(args[0]);
if (!users.limit) return m.reply(`*😿 ¡NO TIENES DIAMANTES SUFICIENTES, VAS A QUEDAR EN LA RUINA!*`);
if (users.limit < count) return m.reply(`*😾 ¡¿CÓMO QUE NO TIENES SUFICIENTE DINERO?! RECUERDA QUE PUEDES VER TU BALANCE CON EL COMANDO:* #bal`);
users.limit -= count * 1;
users.banco += count * 1;
await m.reply(`*[ 🏦 ] HAS INGRESANDO ${count} DIAMANTE AL BANCO*`)}
  
if (command == 'retirar' || command == 'toremove') {     
let user =  global.db.data.users[m.sender]
if (!args[0]) return m.reply(`[ ⚠️ ] *INGRESA LA CANTIDAD A RETIRAR*`);
if (args[0] == '--all') {
let count = parseInt(user.banco);
user.banco -= count * 1
user.limit += count * 1
await m.reply(`*[ 🏦 ] RETIRASTE (${count}) DIAMANTE 💎 DEL BANCO.*`);
return !0 
}
if (!Number(args[0])) return m.reply(`*¡LA CANTIDAD DEBE SER UN NÚMERO VÁLIDO!*`); 
let count = parseInt(args[0]);
if (!user.banco) return m.reply(`*👻 ¡HEY FANTASMA! NO TIENES ESE DINERO EN EL BANCO, ESTÁS VACÍO! 😿*`); 
if (user.banco < count) return m.reply(`*💸 ¡¿CÓMO QUE NO TIENES SUFICIENTE DINERO?! RECUERDA QUE PUEDES CONSULTAR TU BALANCE CON EL COMANDO:* #bal`);
user.banco -= count * 1
user.limit += count * 1
await m.reply(`*[ 🏦 ] HAS RETIRADO (${count}) DINERO DEL BANCO*`)}
}
handler.help = ['dep', 'retirar']
handler.tags = ['econ']
handler.command = /^(dep|depositar|retirar|toremove)$/i
handler.register = true

export default handler 