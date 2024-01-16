import { es, en } from '../lib/multi-language/_default.js' 

export async function before(m,{ conn }) {
let idioma  = global.db.data.users[m.sender].midLanguage
let MID_GB
  
if (idioma == "es") {
MID_GB = es
} else if (idioma == "en") {
MID_GB = en
} else {
MID_GB = mid || es
}
global.mid = MID_GB	
 
try {
    const util = await import("util");
    if (!util.format(...arguments).includes("Closing session: SessionEntry")) return;
    if (!util.format(...arguments).includes("Removing old closed session: SessionEntry")) return;
    // if (!util.format(...arguments).includes("Session error:MessageCounterError:")) 
  } catch (error) {
    console.error("Error al importar 'util':", error);
  }
}
