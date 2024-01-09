import { es, en } from '../lib/multi-language/_default.js'
let MID_GB
export async function before( m, { conn }) {
let idioma  = global.db.data.users[m.sender].midLanguage

  
if (idioma == "es") {
MID_GB = es
} else if (idioma == "en") {
MID_GB = en
} else {
MID_GB = default_language || es
}
global.mid = MID_GB
	
}
