import * as simple from './lib/simple.js'
function botPermisos = (plugins, plugin, conn, _user, noPrefix, m, isROwner, isOwner, isAdmin, isBotAdmin, isMods, isPrems, fail, _prefix) => {
let hl = _prefix 
let adminMode = global.db.data.chats[m.chat].modoadmin
let gata = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugins.command}`
if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && gata) return   

if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Propietarios y Bot Owner
fail('owner', m, conn)
return 
}
if (plugin.rowner && !isROwner) { // Bot Owner
fail('rowner', m, conn)
return
}
if (plugin.owner && !isOwner) { // Propietarios
fail('owner', m, conn)
return
}
if (plugin.mods && !isMods) { // Moderadores 
fail('mods', m, conn)
return
}
if (plugin.premium && !isPrems) { // Premium
fail('premium', m, conn)
return
}
if (plugin.group && !m.isGroup) { // Grupos
fail('group', m, conn)
return
} else if (plugin.botAdmin && !isBotAdmin) { // Admin Bot 
fail('botAdmin', m, conn)
return
} else if (plugin.admin && !isAdmin) { // Admins
fail('admin', m, conn)
return
}
if (plugin.private && m.isGroup) { // para privados
fail('private', m, conn)
return
}
if (plugin.register == true && _user.registered == false) { // registro de usuarios
fail('unreg', m, conn)
return
}
}
export default { botPermisos } 
