import { es, en } from '../lib/multi-language/_default.js'
//global.mid = es

export async function before(m) {
let idioma  = global.db.data.users[m.sender].midLanguage
let MID_GB
  
if (idioma == "es") {
MID_GB = es
} else if (idioma == "en") {
MID_GB = en
} else {
MID_GB = default_language || es
}
global.mid = MID_GB
	
}
await before()
