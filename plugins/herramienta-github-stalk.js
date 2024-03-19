import axios from 'axios'
var handler = async(m, { conn, text, usedPrefix, command }) => {
if (!text) return conn.reply(m.chat, '*⚠️ INGRESE EL NOMBRE DE UN USUARIO DE GITHUB*', m)
try {
await mensajesEditados(conn, m)
let request = await githubstalk(text) 
let { username, following, followers, type, bio, company, blog, location, email, public_repo, public_gists, profile_pic } = request
let thumb = await (profile_pic)
let gata = `*⬤── 「 𝙂𝙄𝙏𝙃𝙐𝘽 𝙎𝙏𝘼𝙇𝙆 」 ──⬤*
➸ *Usuario*: ${username}
➸ *Biografía*: ${bio}
➸ *Compañía*: ${company}
➸ *Correo electrónico:* ${email}
➸ *Repositorios públicos:* ${public_repo}
➸ *Seguidor:* ${followers}
➸ *Siguidores:* ${following}
➸ *Blog:* ${blog}
➸ *Ubicación:* ${location}`
await conn.sendFile(m.chat, logogit, 'githubstalk.jpg', gata, m)
} catch (e) {
await conn.sendMessage(m.chat, {text: `${lenguajeGB['smsMalError3']()}#report ${lenguajeGB['smsMensError2']()} ${usedPrefix + command}\n\n${wm}`, edit: key})
console.log(`❗❗ ${lenguajeGB['smsMensError2']()} ${usedPrefix + command} ❗❗`)
console.log(e)}}
handler.help = ['githubstalk'].map(v => v + ' <query>')
handler.tags = ['internet']
handler.command = /^(githubstalk)$/i

export default handler

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function githubstalk(user) {
    return new Promise((resolve, reject) => {
        axios.get('https://api.github.com/users/'+user)
        .then(({ data }) => {
            let hasil = {
                username: data.login,
                nickname: data.name,
                bio: data.bio,
                id: data.id,
                nodeId: data.node_id,
                profile_pic: data.avatar_url,
                url: data.html_url,
                type: data.type,
                admin: data.site_admin,
                company: data.company,
                blog: data.blog,
                location: data.location,
                email: data.email,
                public_repo: data.public_repos,
                public_gists: data.public_gists,
                followers: data.followers,
                following: data.following,
                ceated_at: data.created_at,
                updated_at: data.updated_at
            }
            resolve(hasil)
        })
    })
}
