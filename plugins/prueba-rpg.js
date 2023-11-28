import { areJidsSameUser } from "@whiskeysockets/baileys"
const leaderboards = [
"exp",
"limit",
"level",
"role",
"money",
"joincount",
"premium",  
]

let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
let users = Object.entries(global.db.data.users).map(([key, value]) => {
return { ...value, jid: key }
})
  
let leaderboard = leaderboards.filter(
(v) => v && users.filter((user) => user && user[v]).length
)

let type = (args[0] || "").toLowerCase()
const getPage = (item) =>
Math.ceil(users.filter((user) => user && user[item]).length / 20);

let wrong = `
Uso: *${usedPrefix}${command} [elemento] [cantidad]*
*${usedPrefix}${command} money 1*

📍 Tipos de lista
${leaderboard
.map((v) =>
`
${rpg.emoticon(v)}${v}
`.trim()
)
.join("\n")}
`.trim();
  
if (!leaderboard.includes(type)) return m.reply(wrong);
let page = isNumber(args[1]) ? Math.min(Math.max(parseInt(args[1]), 0), getPage(type)) : 0
let sortedItem = users.map(toNumber(type)).sort(sort(type))
let userItem = sortedItem.map(enumGetKey)
// let len = args[0] && args[0].length > 0 ? Math.min(100, Math.max(parseInt(args[0]), 5)) : Math.min(5, sortedExp.length)

let text = `
▣› *${rpg.emoticon(type)}${type} Leaderboard* ‹▣
*📑 Página:* ${page} of ${getPage(type)}
*🎖️ Tú:* *${userItem.indexOf(m.sender) + 1}* de *${userItem.length}*

${sortedItem
.slice(page * 20, page * 20 + 20)
.map(
(user, i) =>
"▣\n" +
`│ ${i + 1}〉 ${
participants.some((p) => areJidsSameUser(user.jid, p.id))
? `(${conn.getName(user.jid)}) wa.me/`
: "@"
}${user.jid.split`@`[0]}\n│▸ ${user[type]} ${type}${rpg.emoticon(type)}`
).join`\n┗────────────·····\n\n`}
┗────────────·····
`.trim();
return m.reply(text, null, {
mentions: [...userItem.slice(page * 20, page * 20 + 20)].filter(
(v) => !participants.some((p) => areJidsSameUser(v, p.id))
),
})
}

handler.command = /^(liga|league)$/i;
export default handler;

function sort(property, ascending = true) {
if (property)
return (...args) =>
args[ascending & 1][property] - args[!ascending & 1][property];
else return (...args) => args[ascending & 1] - args[!ascending & 1];
}

function toNumber(property, _default = 0) {
if (property)
return (a, i, b) => {
return {
...b[i],
[property]: a[property] === undefined ? _default : a[property],
}}
else return (a) => (a === undefined ? _default : a)
}

function enumGetKey(a) {
return a.jid
}

function isNumber(number) {
if (!number) return number
number = parseInt(number)
return typeof number == "number" && !isNaN(number)
}
