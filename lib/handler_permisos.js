export default function botPermisos(plugins, plugin, conn, _user, noPrefix, m, isROwner, isOwner, isAdmin, isBotAdmin, isMods, isPrems, fail, _prefix) {
let hl = _prefix 
let adminMode = global.db.data.chats[m.chat].modoadmin
let gata = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl ||  m.text.slice(0, 1) == hl || plugins.command}`
if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && gata) return   

if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) { // Propietarios y Bot Owner
fail('owner', m, this)
return 
}
if (plugin.rowner && !isROwner) { // Bot Owner
fail('rowner', m, this)
return
}
if (plugin.owner && !isOwner) { // Propietarios
fail('owner', m, this)
return
}
if (plugin.mods && !isMods) { // Moderadores 
fail('mods', m, this)
return
}
if (plugin.premium && !isPrems) { // Premium
fail('premium', m, this)
return
}
if (plugin.group && !m.isGroup) { // Grupos
fail('group', m, this)
return
} else if (plugin.botAdmin && !isBotAdmin) { // Admin Bot 
fail('botAdmin', m, this)
return
} else if (plugin.admin && !isAdmin) { // Admins
fail('admin', m, this)
return
}
if (plugin.private && m.isGroup) { // para privados
fail('private', m, this)
return
}
if (plugin.register == true && _user.registered == false) { // registro de usuarios
fail('unreg', m, this)
return
}
}
//export default { botPermisos } 
