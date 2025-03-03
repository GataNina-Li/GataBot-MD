import axios from 'axios'
import fetch from 'node-fetch'
import search from 'yt-search'

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) throw `${lenguajeGB.smsMalused2()} ⊱ *${usedPrefix + command} Bellyache*`;

const spotify = await fetch(`${apis}/search/spotify?q=${text}`);
const song = await spotify.json();
if (!song.data || song.data.length === 0) throw '⚠️ No se encontraron resultados para esa búsqueda.';
const track = song.data[0]; 
let spotifyMessage = `
🪼 *Titulo:* ${track.title}
🪩 *Artista:* ${track.artist}
🦋 *Álbum:* ${track.album}
⏳ *Duración:* ${track.duration}
🔗 *Enlace:* ${track.url}

${gt}`;
await conn.sendMessage(m.chat, {text: spotifyMessage,
contextInfo: {
forwardingScore: 1,
isForwarded: true,
externalAdReply: {
showAdAttribution: true,
containsAutoReply: true,
renderLargerThumbnail: true,
title: track.title,
body: gt,
mediaType: 1,
thumbnailUrl: track.image,
mediaUrl: track.url,
sourceUrl: track.url
}}}, { quoted: m });
m.react('⌛️');
try {
const res = await fetch(`https://api.siputzx.my.id/api/d/spotify?url=${track.url}`);
const data = await res.json();
conn.sendMessage(m.chat, {audio: { url: data.data.download }, fileName: `${track.title}.mp3`,mimetype: 'audio/mpeg'}, { quoted: m });
m.react('✅️');
} catch {
try {
const res = await fetch(`${apis}/download/spotifydl?url=${track.url}`);
const data = await res.json();
conn.sendMessage(m.chat, { audio: { url: data.data.url }, fileName: `${track.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
m.react('✅️');
} catch {
try {
let songInfo = await spotifyxv(text);
if (!songInfo.length) throw `❌ No se encontraron resultados, intente nuevamente.`;
let song = songInfo[0];
const res = await fetch(`https://archive-ui.tanakadomp.biz.id/download/spotify?url=${track.url}`);
const data = await res.json()
await conn.sendMessage(m.chat, { audio: { url: data.result.data.download }, fileName: `${data.result.data.title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
m.react('✅');
} catch (e) {
m.react('❌');
console.error(e);
}
}}}
handler.command = ['spotify', 'music'];
export default handler;

async function spotifyxv(query) {
    let token = await tokens();
    try {
        let response = await axios({
            method: 'get',
            url: 'https://api.spotify.com/v1/search?q=' + query + '&type=track',
            headers: {
                Authorization: 'Bearer ' + token,
            },
        });
        const tracks = response.data.tracks.items;
        const results = tracks.map((track) => ({
            name: track.name,
            artista: track.artists.map((artist) => artist.name),
            album: track.album.name,
            duracion: timestamp(track.duration_ms),
            url: track.external_urls.spotify,
            imagen: track.album.images.length ? track.album.images[0].url : '',
        }));
        return results;
    } catch (error) {
        console.error(`Error en spotifyxv: ${error}`);
        return [];
    }
}

async function tokens() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + Buffer.from('acc6302297e040aeb6e4ac1fbdfd62c3:0e8439a1280a43aba9a5bc0a16f3f009').toString('base64'),
            },
            data: 'grant_type=client_credentials',
        });
        return response.data.access_token;
    } catch (error) {
        console.error(`Error en tokens: ${error}`);
        throw new Error('No se pudo obtener el token de acceso');
    }
}

function timestamp(time) {
    const minutes = Math.floor(time / 60000);
    const seconds = Math.floor((time % 60000) / 1000);
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}