import fetch from 'node-fetch'
import axios from 'axios'
import fs from 'fs'

var handler = m => m
handler.all = async function (m) {

const response = await fetch('https://raw.githubusercontent.com/GataNina-Li/GataBot-MD/master/official_accounts.json')  
const data = await response.json()
let { accounts, channels, groups, collaboration, sponsors, others } = data.info

global.yt = accounts.youTube
global.yt2 = others.yt_vid
global.ig = accounts.instagram
global.md = accounts.gatabot_md
global.fb = accounts.facebook
global.tk = accounts.tiktok
global.ths = accounts.threads
global.paypal = accounts.paypal
global.asistencia = others.assistance_num
global.bot = 'No disponible'
global.cuentas = accounts.all

global.canal1 = channels.channel1
global.canal2 = channels.channel2
global.canal3 = channels.channel3
global.canal4 = channels.channel4

global.grupo1 = groups.group1
global.grupo2 = groups.group2
global.grupo3 = groups.group3
global.grupo4 = groups.group4
global.grupo5 = groups.group5
global.grupo6 = groups.group6

global.grupo_collab1 = collaboration.group1
global.grupo_collab2 = collaboration.group2
global.grupo_collab3 = collaboration.group3
global.grupo_collab4 = collaboration.group4

global.patrocinador1 = sponsors.boxmine
global.patrocinador2 = sponsors.cafirexos
global.patrocinador3 = sponsors.vortexus
global.patrocinador4 = sponsors.asif

global.canales = [canal1, canal2, canal3, canal4].getRandom()
global.welgata = [tk, ig, yt2, yt2, ig, md, ig, yt, paypal, yt2, yt2, ig, fb, tk, ths, asistencia].getRandom()
global.redesMenu = [canal1, canal2, canal3, canal4, grupo1, grupo2, grupo3, grupo4, grupo5, grupo6, md, ig, paypal, yt, asistencia, fb, tk].getRandom()
global.accountsgb = [canal1, canal2, canal3, canal4, tk, ig, yt, paypal, fb, ths, md, nna, asistencia].getRandom()

global.fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }
}
export default handler
