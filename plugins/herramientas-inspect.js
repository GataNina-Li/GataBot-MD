//import * as baileys from '@adiwajshing/baileys'
let baileys = (await import(global.baileys)).default

let handler = async (m, { conn, text }) => {
	let [, code] = text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []
	if (!code) throw `${lenguajeGB['smsAvisoMG']()}𝙄𝙉𝙂𝙍𝙀𝙎𝙀 𝙀𝙇 𝙇𝙄𝙉𝙆 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊`
	let res = await conn.query({ tag: 'iq', attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' }, content: [{ tag: 'invite', attrs: { code } }] }),
		data = extractGroupMetadata(res),
		txt = Object.keys(data).map(v => `*${v.capitalize()}:* ${data[v]}`).join('\n'),
		pp = await conn.profilePictureUrl(data.id, 'image').catch(console.error)
let groupinfo = `*┏━━━━━━━━━━━━━━━┓*
*┃☂️ ⫹⫺ ID:* ${data.id}◞
*┃🧪 ⫹⫺ Nombre:* ${data.subject}
*┃📅 ⫹⫺ Creado:* ${data.creation}
*┃👑 ⫹⫺ Owner:* ${data.owner}
*┗━━━━━━━━━━━━━━━┛*`
//await conn.reply(m.chat, groupinfo, m)
await await conn.sendButton(m.chat, groupinfo, `*Copiar Descripción 👇*`, pp, [['𝙑𝙤𝙡𝙫𝙚𝙧 𝙖𝙡 𝙈𝙚𝙣𝙪́ | 𝘽𝙖𝙘𝙠 𝙩𝙤 𝙈𝙚𝙣𝙪', '/menu']], `https://www.whatsapp.com/otp/copy/${data.desc}`, null, null, m)
//conn.sendMessage(m.chat, { text: `*┏━━━━━━━━━━━━━━┓*\n┃¿Desa copiar la desc? •🌷\n*┗━━━━━━━━━━━━━━┛*`, templateButtons: botones, footer: wm })
}
handler.command = /^(inspect)$/i

export default handler
handler.owner = false

const extractGroupMetadata = (result) => {
	const group = baileys.getBinaryNodeChild(result, 'group')
	const descChild = baileys.getBinaryNodeChild(group, 'description')
	let desc
	if (descChild) desc = baileys.getBinaryNodeChild(descChild, 'body')?.content
	const metadata = {
		id: group.attrs.id.includes('@') ? group.attrs.id : baileys.jidEncode(group.attrs.id, 'g.us'),
		subject: group.attrs.subject,
		creation: new Date(+group.attrs.creation * 1000).toLocaleString('id', { timeZone: 'America/Los_Angeles' }),
		owner: group.attrs.creator ? 'wa.me/' + baileys.jidNormalizedUser(group.attrs.creator).split('@')[0] : undefined,
		desc
	}
	return metadata
}


/*import * as baileys from '@adiwajshing/baileys'

let handler = async (m, { conn, text }) => {
	let [, code] = text.match(/chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []
	if (!code) throw '*⚠️ Ingrese el link de un grupo*'
	let res = await conn.query({ tag: 'iq', attrs: { type: 'get', xmlns: 'w:g2', to: '@g.us' }, content: [{ tag: 'invite', attrs: { code } }] }),
		data = extractGroupMetadata(res),
		txt = Object.keys(data).map(v => `*${v.capitalize()}:* ${data[v]}`).join('\n'),
		pp = await conn.profilePictureUrl(data.id, 'image').catch(console.error)
		let groupinfo = `
*┏━━━━━━━━━━━━━━━┓*
*┃☂️ ⫹⫺ ID:* ${data.id}◞
*┃🧪 ⫹⫺ Nombre:* ${data.subject}
*┃📅 ⫹⫺ Creado:* ${data.creation}
*┃👑 ⫹⫺ Owner:* ${data.owner}
*┗━━━━━━━━━━━━━━━┛*
`
	await conn.reply(m.chat, groupinfo, m)
	const botones = [
{index: 1, urlButton: {displayText: `Copiar Descripción 🍓`, url: `https://www.whatsapp.com/otp/copy/${data.desc}`}},
]
await conn.sendMessage(m.chat, { text: `*┏━━━━━━━━━━━━━━┓*\n┃¿Desa copiar la desc? •🌷\n*┗━━━━━━━━━━━━━━┛*`, templateButtons: botones, footer: wm })
}
handler.command = /^(inspect)$/i

export default handler
handler.owner = false

const extractGroupMetadata = (result) => {
	const group = baileys.getBinaryNodeChild(result, 'group')
	const descChild = baileys.getBinaryNodeChild(group, 'description')
	let desc
	if (descChild) desc = baileys.getBinaryNodeChild(descChild, 'body')?.content
	const metadata = {
		id: group.attrs.id.includes('@') ? group.attrs.id : baileys.jidEncode(group.attrs.id, 'g.us'),
		subject: group.attrs.subject,
		creation: new Date(+group.attrs.creation * 1000).toLocaleString('id', { timeZone: 'America/Los_Angeles' }),
		owner: group.attrs.creator ? 'wa.me/' + baileys.jidNormalizedUser(group.attrs.creator).split('@')[0] : undefined,
		desc
	}
	return metadata
}*/
