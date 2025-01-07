import db from '../lib/database.js';
import ws from 'ws';
import { cpus as _cpus, totalmem, freemem, platform, hostname, version, release, arch } from 'os';
import os from 'os';
import moment from 'moment';
import speed from 'performance-now';
import { sizeFormatter } from 'human-readable';

let format = sizeFormatter({std: 'JEDEC', decimalPlaces: 2, keepTrailingZeroes: false, render: (literal, symbol) => `${literal} ${symbol}B`,});

const used = process.memoryUsage();

async function getSystemInfo() {
    let cpuInfo = os.cpus();
    let modeloCPU = cpuInfo && cpuInfo.length > 0 ? cpuInfo[0].model : 'Modelo de CPU no disponible';
    let espacioTotalDisco = 'Información no disponible';

    const data = {
        latencia: 'No disponible',
        plataforma: os.platform(),
        núcleosCPU: cpuInfo ? cpuInfo.length : 'No disponible',
        modeloCPU: modeloCPU,
        arquitecturaSistema: os.arch(),
        versiónSistema: os.release(),
        procesosActivos: os.loadavg()[0],
        porcentajeCPUUsada: 'No disponible',
        memory: humanFileSize(used.free, true, 1) + ' libre de ' + humanFileSize(used.total, true, 1),
        ramUsada: 'No disponible',
        ramTotal: 'No disponible',
        ramLibre: 'No disponible',
        porcentajeRAMUsada: 'No disponible',
        espacioTotalDisco: espacioTotalDisco,
        tiempoActividad: 'No disponible',
        cargaPromedio: os.loadavg().map((avg, index) => `${index + 1} min: ${avg.toFixed(2)}.`).join('\n'),
        horaActual: new Date().toLocaleString(),
    };

    const startTime = Date.now();
    const endTime = Date.now();
    data.latencia = `${endTime - startTime} ms`;

    return data;
}

let handler = async (m, { conn, usedPrefix }) => {
    let bot = global.db.data.settings[conn.user.jid];
    let _uptime = process.uptime() * 1000;
    let uptime = new Date(_uptime).toISOString().substr(11, 8);
    let totalreg = Object.keys(global.db.data.users).length;
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length;
    let totalbots = Object.keys(global.db.data.settings).length;
    let totalStats = Object.values(global.db.data.stats).reduce((total, stat) => total + stat.total, 0);
    const chats = Object.entries(conn.chats).filter(([id, data]) => id && data.isChats);
    let totalchats = Object.keys(global.db.data.chats).length;
    let totalf = Object.values(global.plugins).filter(v => v.help && v.tags).length;
    const groupsIn = chats.filter(([id]) => id.endsWith('@g.us'));
    let totaljadibot = [...new Set([...global.conns.filter((conn) => conn.user && conn.ws.socket && conn.ws.socket.readyState !== ws.CLOSED).map((conn) => conn)])];
    const totalUsers = totaljadibot.length;
    let timestamp = speed();
    let latensi = speed() - timestamp;
    const { restrict } = global.db.data.settings[conn.user.jid] || {}
    const { autoread } = global.opts
    let pp = gataMenu

getSystemInfo().then(async (data) => {
let info = `╭━━━━[ ${gt} ]━━━━━⬣
┃➥ *CREADORA | CREATOR*
┃ღ *𝙂𝙖𝙩𝙖 𝘿𝙞𝙤𝙨*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *CONTACTO | CONTACT* 
┃ღ *${ig}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃𓃠 *VERSIÓN ACTUAL | VERSION*
┃ღ ${vs}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *PREFIJO | PREFIX*
┃ღ *${usedPrefix}*
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *TOTAL COMANDOS | COMMANDS*
┃ღ ${totalf}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *CHATS PRIVADOS | PRIVATE CHAT*
┃ღ ${chats.length - groupsIn.length}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *CHATS DE GRUPOS | GROUP CHAT*
┃ღ ${groupsIn.length}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *CHATS EN TOTAL | TOTAL CHATS*
┃ღ ${chats.length}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *ACTIVIDAD | ACTIVITY* 
┃ღ ${uptime}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *VELOCIDAD | SPEED*
 ${latensi.toFixed(4)} ms
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *BOT SECUNDARIOS ACTIVOS | ACTIVE SECONDARY BACKS* 
┃ღ ${totalUsers}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *COMANDO EJECUTANDO | COMMAND EXECUTING* 
┃ღ ${toNum(totalStats)}/${totalStats}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *GRUPOS REGISTRANDO | REGISTERED GROUPS* 
┃ღ ${toNum(totalchats)}/${totalchats}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *USUARIOS REGISTRADO | USERS REGISTRATION* 
┃ღ ${rtotalreg} de ${totalreg} users totales
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *AUTOREAD*
┃ღ ${autoread ? '*Activado ✔*' : '*Desactivado ✘*'}
┃┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈┈
┃➥ *RESTRICT* 
┃ღ ${restrict ? '*Activado ✔*' : '*Desactivado ✘*'} 
┃
╰━━━[ 𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙘𝙞ó𝙣 | 𝙄𝙣𝙛𝙤𝙧𝙢𝙖𝙩𝙞𝙤𝙣 ]━━⬣
`;

await conn.sendFile(m.chat, gataImg, 'lp.jpg', info, fkontak, false, { contextInfo: {externalAdReply :{ mediaUrl: null, mediaType: 1, description: null, title: gt, body: ' 😻 𝗦𝘂𝗽𝗲𝗿 𝗚𝗮𝘁𝗮𝗕𝗼𝘁-𝗠𝗗 - 𝗪𝗵𝗮𝘁𝘀𝗔𝗽𝗽 ', previewType: 0, thumbnail: gataImg, sourceUrl: accountsgb }}});
});
}
handler.help = ['infobot']
handler.tags = ['info', 'tools']
handler.command = /^(infobot|informacionbot|infogata|informacióngata|informaciongata)$/i
export default handler;

function toNum(number) {
    if (number >= 1000 && number < 1000000) {
        return (number / 1000).toFixed(1) + 'k';
    } else if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else if (number <= -1000 && number > -1000000) {
        return (number / 1000).toFixed(1) + 'k';
    } else if (number <= -1000000) {
        return (number / 1000000).toFixed(1) + 'M';
    } else {
        return number.toString();
    }
}

function humanFileSize(bytes) {
    const unidades = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    const exponente = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, exponente)).toFixed(2)} ${unidades[exponente]}`;
}
