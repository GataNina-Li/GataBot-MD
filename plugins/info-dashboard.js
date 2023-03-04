let handler = async (m, { conn }) => {
  let stats = Object.entries(db.data.stats).map(([key, val]) => {
    let name = Array.isArray(plugins[key]?.help) ? plugins[key]?.help?.join(' & ') : plugins[key]?.help || key 
    if (/exec/.test(name)) return
    return { name, ...val }
  })
  stats = stats.sort((a, b) => b.total - a.total)
  let txt = stats.slice(0, 10).map(({ name, total, last }, idx) => {
    if (name.includes('-') && name.endsWith('.js')) name = name.split('-')[1].replace('.js', '')
    return `(${idx + 1})\n*📚 Comando : ${name}*\n*🗂️ Usos : ${total}x*\n*📍 Ultimo uso : ${getTime(last)}*`
  }).join`\n\n`
  m.reply(`*☘️ Dashboard de ${conn.user.name} ☘️*\n*Los comandos usados en los últimos minutos*\n\n${txt}`)
}
handler.help = ['dashboard']
handler.tags = ['info']
handler.command = /^dashboard$/i

export default handler

export function parseMs(ms) {
  if (typeof ms !== 'number') throw 'Parameter must be filled with number'
  return {
    Dias: Math.trunc(ms / 86400000),
    Horas: Math.trunc(ms / 3600000) % 24,
    Minutos: Math.trunc(ms / 60000) % 60,
    Segundos: Math.trunc(ms / 1000) % 60,
    Milisegundos: Math.trunc(ms) % 1000,
    Microsegundos: Math.trunc(ms * 1000) % 1000,
    Nanosegundos: Math.trunc(ms * 1e6) % 1000
  }
}

export function getTime(ms) {
  let now = parseMs(+new Date() - ms)
  if (now.days) return `${now.days} days ago`
  else if (now.hours) return `${now.hours} hours ago`
  else if (now.minutes) return `${now.minutes} minutes ago`
  else return `a few seconds ago`
}
