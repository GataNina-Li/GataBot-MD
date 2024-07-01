let handler = async function (m, { conn, text, command, usedPrefix }) {
let miEstado
let user = global.db.data.users[m.sender]
let name = await conn.getName(m.sender)
let emoji = [ 
'😀', '😃', '😄', '😁', '😆', '🥹', '😅', '😂' ,'🤣', '🥲',
'☺️', '😊' ,'😇', '🙂', '🙃', '😉', '😌' ,'😍', '🥰', '😘', 
'😗', '😙' ,'😚', '😋', '😛', '😝', '😜' ,'🤪', '🤨', '🧐', 
'🤓', '😎' ,'🥸', '🤩', '🥳', '😏', '😒' ,'😞', '😔', '😟',
'😕', '🙁' ,'☹️', '😣', '😖', '😫', '😩' , '🥺', '😢', '😭',
'😤', '😠' ,'😡', '🤬', '🤯', '😳', '🥵' ,'🥶', '😶‍🌫️', '😱',
'😨', '😰' ,'😥', '😓', '🤗', '🤔', '🫣' ,'🤭', '🫢', '🫡',
'🤫', '🫠' ,'🤥', '😶', '🫥', '😐', '🫤' ,'😑', '😬', '🙄',
'😯', '😦' ,'😧', '😮', '😲', '🥱', '😴' ,'🤤', '😪', '😮‍💨',
'😵', '😵‍💫' ,'🤐', '🥴', '🤢', '🤮', '🤧' ,'😷', '🤒', '🤕',
'🤑', '🤠' ,'😈', '👿', '🤡' 
]

let significado = [
'Animado/a', 'Contento/a', 'Feliz', 'Sonriente', 'Risueño/a', 'Orgulloso/a', 'Desenmascarado/a', 'Divertido/a' ,'Gracioso/a', 'Apenado/a',
'Amistoso/a', 'Amable' ,'Inocente', 'Cordial', 'Sarcastico/a', 'Coqueto/a' ,'Aliviado/a', 'Enamorado/a', 'Cariñoso/a', 'Afectuoso/a',
'Amoroso/a', 'Tierno/a', 'Empalagoso/a', 'Gustoso/a' ,'Bromista', 'Disgustado/a', 'Travieso/a', 'Loco/a', 'Desconfiado/a', 'Curioso/a', 
'Estudioso/a', 'Valiente' ,'Disfrazado/a', 'Entusiasmado/a', 'Festivo/a', 'Provocativo/a', 'Decepcionado/a' ,'Deprimido/a', 'Desanimado/a', 'Temeroso/a', 
'Inseguro/a', 'Desconsolado/a' ,'Infeliz', 'Angustiado/a', 'Estresado/a', 'Cansado/a', 'Frustrado/a' ,'Tierno/a', 'Dolorido/a', 'Lloroso/a',
'Exasperado/a', 'Irritado/a' ,'Enojado/a', 'Furioso/a', 'Asombrado/a', 'Sonrojado/a', 'Caluroso/a' ,'Frío/a', 'Timido/a ', 'Asustado/a',
'Preocupado/a', 'Aterrorizado/a' ,'Inquieto/a', 'Debil', 'Apoyado/a', 'Pensativo/a', 'Fascinado/a' ,'Pícaro/a', 'Avergonzado/a', 'Respetado/a',
'Misterioso/a', 'Impaciente' ,'Mentiroso/a', 'Indiferente', 'Introvertido/a', 'Inexpresivo/a', 'Confuso/a' ,'Aburrido/a', 'Incómodo/a', 'Fastidiado/a',
'Maravillado/a', 'Atónito/a' ,'Intranquilo/a', 'Sorprendido/a', 'Impactado/a', 'Fatigado/a', 'Dormido/a' ,'Apetitoso/a', 'Ilusionado/a', 'Resoplido/a',
'Mareado/a', 'Hipnotizado/a' ,'Silencioso/a', 'Espontáneo/a', 'Náuseas', 'Asqueado/a', 'Resfriado/a' ,'Protegido/a', 'Enfermizo/a', 'Lastimado/a',
'Afortunado/a', 'Actor/Actriz' ,'Malvado/a', 'Diabólico/a', 'Payasesco/a'
]

let sections = Object.keys(emoji, significado).map((v, index) => ({ title: `🤔 CÓMO ESTÁ HOY?`,
rows: [{ title: `» ${emoji[v]}${emoji[v]}${emoji[v]}${emoji[v]}`, description: `${1 + index}. ${significado[v]}`, id: usedPrefix + command + ' ' + text + significado[v] + ' ' + emoji[v], }], }))

const listMessage = {
text: `❖ ${user.registered === true ? user.name : name}\n👋 *SELECCIONE SU ESTADO ACTUAL POR FAVOR*\n*❖ SU ESTADO ACTUAL:* ${typeof user.miestado === 'string' ? user.miestado : 'Estado no asignado'}\n\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹ 》*`,
footer: wm,
title: "*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹ 》*\n",
buttonText: "👉 MI ESTADO 👈",
sections
} 

if (command == 'miestado') { 
if (!text) return conn.sendMessage(m.chat, {text: `❖ CÓMO ESTÁ HOY? 🤔 ${user.registered === true ? user.name : name}\n\n*╭⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹ 》*\n👋 *SELECCIONE SU ESTADO ACTUAL POR FAVOR*\n*❖ SU ESTADO ACTUAL:* ${typeof user.miestado === 'string' ? user.miestado : 'Estado no asignado\n❖ Ejemplo /miestado 😃'}\n*╰⸺ ⊹ ⸺  ⊹ ⸺ ⊹ ⸺ ⊹ ⸺ ⊹ 》*`}, {quoted: fkontak})
miEstado = text.trim()
user.miestado = miEstado
if (text) return //conn.sendMessage(m.chat, {text: eg + `*GENIAL!! SE HA AGREGADO UN ESTADO*\n*- - - - - - - - - - - - - - - - - - - - - - - - - - - -*\n\n` + `*❖ SU ESTADO:* ${user.miestado}`}, {quoted: fkontak})
conn.sendButton(m.chat, eg + `*GENIAL!! SE HA AGREGADO UN ESTADO*\n*- - - - - - - - - - - - - - - - - - - - - - - - - - - -*\n\n` + `*❖ SU ESTADO:* ${user.miestado}`, wm, null, [[`🐈 MENU`, usedPrefix + 'menu']], m)
miEstado = 0
}}
handler.command = ['miestado'] 
handler.register = true
export default handler
