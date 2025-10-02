const handler = async (m, { conn, text, usedPrefix, command }) => {
  normalizeOwnerList();

  const cmd = String(command || '').toLowerCase();


  if (cmd === 'owners') {
    const list = (global.owner || []).map((n, i) => `${i + 1}. ${n}`).join('\n') || '(vacía)';
    return conn.reply(m.chat, `📋 *Owners*\n${list}`, m);
  }

 
  const whoJid = getTargetJid(m, text);      
  const bare   = toBare(whoJid);              
  const mentionJid = toJid(whoJid);           

  if (!bare) {
    const ejemplo = `${usedPrefix + command} @${m.sender.split('@')[0]}`;
    return conn.reply(
      m.chat,
      `${lenguajeGB?.['smsAvisoMG']?.() || ''} *𝙐𝙎𝘼𝙍 𝙀𝙇 𝘾𝙊𝙈𝘼𝙉𝘿𝙊 𝘿𝙀 𝙀𝙎𝙏𝘼 𝙁𝙊𝙍𝙈𝘼*\n𝙀𝙅𝙀𝙈𝙋𝙇𝙊 : ${ejemplo}`,
      m,
      { mentions: [m.sender] }
    );
  }

  if (cmd === 'addowner') {
   
    if (findOwnerIndex(global.owner, bare) !== -1) {
      return conn.reply(
        m.chat,
        `${lenguajeGB?.['smsAvisoEG']?.() || ''} *Ese número ya está en owners.*`,
        m,
        { mentions: [mentionJid] }
      );
    }

    global.owner.push(bare);

    return conn.reply(
      m.chat,
      `${lenguajeGB?.['smsAvisoEG']?.() || ''}\n\n*𝙉𝙐𝙀𝙑𝙊 𝙉𝙐𝙈𝙀𝙍𝙊 𝘼𝙂𝙍𝙀𝙂𝘼𝘿𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊𝙎 𝘾𝙊𝙈𝙊 𝙋𝙍𝙊𝙋𝙄𝙀𝙏𝘼𝙍𝙄𝙊(𝘼)*`,
      m,
      { mentions: [mentionJid] }
    );
  }

  if (cmd === 'delowner') {
    const idx = findOwnerIndex(global.owner, bare);
    if (idx === -1) {
      return conn.reply(
        m.chat,
        `${lenguajeGB?.['smsAvisoFG']?.() || ''}*𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙄𝙉𝙂𝙍𝙀𝙎𝘼𝘿𝙊 𝙉𝙊 𝙀𝙓𝙄𝙎𝙏𝙀 𝙀𝙉 𝙇𝘼 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙊𝙒𝙉𝙀𝙍𝙎.*`,
        m
      );
    }

    global.owner.splice(idx, 1);

    return conn.reply(
      m.chat,
      `${lenguajeGB?.['smsAvisoEG']?.() || ''} *𝙀𝙇 𝙉𝙐𝙈𝙀𝙍𝙊 𝙁𝙐𝙀 𝙀𝙇𝙄𝙈𝙄𝙉𝘼𝘿𝙊 𝘾𝙊𝙉 𝙀𝙓𝙄𝙏𝙊𝙎 𝘿𝙀 𝙇𝘼 𝙇𝙄𝙎𝙏𝘼 𝘿𝙀 𝙊𝙒𝙉𝙀𝙍𝙎.*`,
      m,
      { mentions: [mentionJid] }
    );
  }
};

handler.help = ['addowner @usuario|num', 'delowner @usuario|num', 'owners'];
handler.tags = ['owner'];
handler.command = /^(addowner|delowner|owners)$/i;
handler.rowner = true; 

export default handler;


const s = (v) => (typeof v === 'string' ? v : (v == null ? '' : String(v)));
const onlyDigits = (v) => s(v).replace(/\D/g, '');
const toBare = (who) => onlyDigits(s(who).split('@')[0]);                 // "521XXXXXXXXX"
const toJid  = (who) => (toBare(who) ? toBare(who) + '@s.whatsapp.net' : '');


function getTargetJid(m, text) {
  if (Array.isArray(m?.mentionedJid) && m.mentionedJid.length) return m.mentionedJid[0];
  if (m?.quoted?.sender) return m.quoted.sender;
  if (text) {
    const bare = onlyDigits(text);
    if (bare) return bare + '@s.whatsapp.net';
  }
  return '';
}


function findOwnerIndex(list, bare) {
  return list.findIndex((it) => {
    const val = Array.isArray(it) ? s(it[0]) : s(it);
    return onlyDigits(val) === bare;
  });
}


function normalizeOwnerList() {
  if (!Array.isArray(global.owner)) global.owner = [];
  global.owner = global.owner
    .map((it) => {
      const val = Array.isArray(it) ? s(it[0]) : s(it);
      return toBare(val);
    })
    .filter(Boolean);
}


