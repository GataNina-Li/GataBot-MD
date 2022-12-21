const roles = {
    '*NOVATO(A) V* 🪤': 0,
     '*NOVATO(A) IV* 🪤': 1,
      '*NOVATO(A) III* 🪤': 2,
       '*NOVATO(A) II* 🪤': 3,
        '*NOVATO(A) I* 🪤': 4,
    '*APRENDIS V* 🪚': 5,
     '*APRENDIS IV* 🪚': 6,
      '*APRENDIS III* 🪚': 7,
       '*APRENDIS II* 🪚': 8,
       '*APRENDIS I* 🪚': 9,
    '*EXPLORADOR(A) V* 🪓': 10,
     '*EXPLORADOR(A) IV* 🪓': 11,
      '*EXPLORADOR(A) III* 🪓': 12,
       '*EXPLORADOR(A) II* 🪓': 13,
        '*EXPLORADOR(A) I* 🪓': 14,
    '*MAESTRO(A) V* ⚒️': 15,
     '*MAESTRO(A) IV* ⚒️': 16,
      '*MAESTRO(A) III* ⚒️': 17,
       '*MAESTRO(A) II* ⚒️': 18,
        '*MAESTRO(A) I* ⚒️': 19,
    '*IRON V* 🦾': 20,
     '*IRON IV* 🦾': 21,
      '*IRON III* 🦾': 22,
       '*IRON II* 🦾': 23,
        '*IRON I* 🦾': 24,
    '*PLATA V* 🔮': 25,
     '*PLATA IV* 🔮': 26,
      '*PLATA III* 🔮': 27,
       '*PLATA II* 🔮': 28,
        '*PLATA I* 🔮': 29,
    '*ORO V* 🏅': 30,
     '*ORO IV* 🏅': 31,
      '*ORO III* 🏅': 32,
       '*ORO II* 🏅': 33,
        '*ORO I* 🏅': 34,
    '*DIAMANTE V* 💎': 35,
     '*DIAMANTE IV* 💎': 36,
      '*DIAMANTE III* 💎': 37,
       '*DIAMANTE II* 💎': 38,
        '*DIAMANTE I* 💎': 39,
    '*PRO EN GATABOT V* 😼': 40,
     '*PRO EN GATABOT IV* 😼': 41,
      '*PRO EN GATABOT III* 😼': 42,
       '*PRO EN GATABOT II* 😼': 43,
        '*PRO EN GATABOT I* 😼': 44,
    '*SUPER PRO V* 🎩': 45,
     '*SUPER PRO IV* 🎩': 46,
      '*SUPER PRO III* 🎩': 47,
       '*SUPER PRO II* 🎩': 48,
        '*SUPER PRO I* 🎩': 49,
    '*LEGENDARIO(A) V* 🛡️': 50,
     '*LEGENDARIO(A) IV* 🛡️': 51,
      '*LEGENDARIO(A) III* 🛡️': 52,
       '*LEGENDARIO(A) II* 🛡️': 53,
        '*LEGENDARIO(A) I* 🛡️': 54,
    '*LEYENDA V* 🏆': 55,
     '*LEYENDA IV* 🏆': 56,
      '*LEYENDA III* 🏆': 57,
       '*LEYENDA II* 🏆': 58,
       '*LEYENDA I* 🏆': 59,
    '*ESTELAR V* ☄️': 60,
     '*ESTELAR IV* ☄️': 61,
      '*ESTELAR III* ☄️': 62,
       '*ESTELAR II* ☄️': 63,
        '*ESTELAR I* ☄️': 64,
    '*TOP ASTRAL V* ⚜️🔱': 65,
     '*TOP ASTRAL IV* ⚜️🔱': 66,
      '*TOP ASTRAL III* ⚜️🔱': 67,
       '*TOP ASTRAL II* ⚜️🔱': 68,
        '*TOP ASTRAL I* ⚜️🔱': 69,
    '👑 *ÉLITE GLOBAL V* 🏁': 70,
     '👑 *ÉLITE GLOBAL IV* 🏁': 75,
      '👑 *ÉLITE GLOBAL III* 🏁': 80,
       '👑 *ÉLITE GLOBAL II* 🏁': 85,
        '👑 *ÉLITE GLOBAL I* 🏁': 90,
    '👑 *∞ ÉLITE GLOBAL V* 💎🏁': 100,
     '👑 *∞ ÉLITE GLOBAL IV* 💎🏁': 140,
    '👑 *∞ ÉLITE GLOBAL III* 💎🏁': 180,
    '👑 *∞ ÉLITE GLOBAL II* 💎🏁': 250,
    '👑 *∞ ÉLITE GLOBAL I* 💎🏁': 300
}

export function before(m) {
        let user = db.data.users[m.sender]
        let level = user.level
        let role = (Object.entries(roles).sort((a, b) => b[1] - a[1]).find(([, minLevel]) => level >= minLevel) || Object.entries(roles)[0])[0]
        user.role = role
        return !0
    
}

/*let handler = m => m

handler.before = function (m, text) {
    let user = global.db.data.users[m.sender]
    let role = (user.level <= 3) ? '*NOVATO(A) III* 🪤'
        : ((user.level >= 3) && (user.level <= 6)) ? '*NOVATO(A) II* 🪤'
            : ((user.level >= 6) && (user.level <= 9)) ? '*NOVATO(A) I* 🪤'
                : ((user.level >= 9) && (user.level <= 12)) ? '*APRENDIS III* 🪚'
                    : ((user.level >= 12) && (user.level <= 15)) ? '*APRENDIS II* 🪚'
                        : ((user.level >= 15) && (user.level <= 18)) ? '*APRENDIS I* 🪚'
                            : ((user.level >= 18) && (user.level <= 21)) ? '*EXPLORADOR(A) III* 🪓'
                                : ((user.level >= 21) && (user.level <= 24)) ? '*EXPLORADOR(A) II* 🪓'
                                    : ((user.level >= 24) && (user.level <= 27)) ? '*EXPLORADOR(A) I* 🪓'
                                        : ((user.level >= 27) && (user.level <= 30)) ? '*MAESTRO(A) III* ⚒️'
                                            : ((user.level >= 30) && (user.level <= 33)) ? '*MAESTRO(A) II* ⚒️'
                                                : ((user.level >= 33) && (user.level <= 36)) ? '*MAESTRO(A) I* ⚒️'
                                                    : ((user.level >= 36) && (user.level <= 39)) ? '*IRON III* 🦾'
                                                        : ((user.level >= 39) && (user.level <= 42)) ? '*IRON II* 🦾'
                                                            : ((user.level >= 42) && (user.level <= 45)) ? '*IRON I* 🦾'
                                                                : ((user.level >= 45) && (user.level <= 48)) ? '*PLATA III* 🔮'
                                                                    : ((user.level >= 48) && (user.level <= 51)) ? '*PLATA II* 🔮'
                                                                        : ((user.level >= 51) && (user.level <= 54)) ? '*PLATA I* 🔮'
                                                                            : ((user.level >= 54) && (user.level <= 57)) ? '*ORO III* 🏅'
                                                                                : ((user.level >= 57) && (user.level <= 60)) ? '*ORO II* 🏅'
                                                                                    : ((user.level >= 60) && (user.level <= 63)) ? '*ORO I* 🏅'
                                                                                        : ((user.level >= 63) && (user.level <= 66)) ? '*DIAMANTE III* 💎'
                                                                                            : ((user.level >= 66) && (user.level <= 69)) ? '*DIAMANTE II* 💎'
                                                                                                : ((user.level >= 69) && (user.level <= 71)) ? '*DIAMANTE I* 💎'
                                                                                                    : ((user.level >= 71) && (user.level <= 74)) ? '*PRO EN GATABOT III* 😼'
                                                                                                        : ((user.level >= 74) && (user.level <= 77)) ? '*PRO EN GATABOT II* 😼'
                                                                                                            : ((user.level >= 77) && (user.level <= 80)) ? '*PRO EN GATABOT I* 😼'
                                                                                                                : ((user.level >= 80) && (user.level <= 83)) ? '*SUPER PRO III* 🎩'
                                                                                                                    : ((user.level >= 83) && (user.level <= 86)) ? '*SUPER PRO II* 🎩'
                                                                                                                        : ((user.level >= 86) && (user.level <= 89)) ? '*SUPER PRO I* 🎩'
                                                                                                                            : ((user.level >= 89) && (user.level <= 91)) ? '*LEGENDARIO(A) III* 🛡️'
                                                                                                                                : ((user.level >= 91) && (user.level <= 94)) ? '*LEGENDARIO(A) II* 🛡️'
                                                                                                                                    : ((user.level >= 94) && (user.level <= 97)) ? '*LEGENDARIO(A) I* 🛡️'
                                                                                                                                        : ((user.level >= 97) && (user.level <= 100)) ? '*LEYENDA III* 🏆'
                                                                                                                                           : ((user.level >= 100) && (user.level <= 105)) ? '*LEYENDA II* 🏆'      
                                                                                                                                              : ((user.level >= 105) && (user.level <= 120)) ? '*LEYENDA I* 🏆'
                                                                                                                                                 : ((user.level >= 120) && (user.level <= 150)) ? '*ESTELAR III* ☄️'
                                                                                                                                                    : ((user.level >= 150) && (user.level <= 160)) ? '*ESTELAR II* ☄️'
                                                                                                                                                        : ((user.level >= 160) && (user.level <= 170)) ? '*ESTELAR I* ☄️'
                                                                                                                                                            : ((user.level >= 170) && (user.level <= 185)) ? '*TOP ASTRAL III* ⚜️🔱'
                                                                                                                                                                : ((user.level >= 185) && (user.level <= 200)) ? '*TOP ASTRAL III* ⚜️🔱'
                                                                                                                                                                    : ((user.level >= 200) && (user.level <= 700)) ? '*TOP ASTRAL III* ⚜️🔱'
                                                                                                                                                                            : ((user.level >= 700) && (user.level <= 1000)) ? '👑 *ÉLITE GLOBAL* 🏁'
                                                                                                                                                                                : '👑 *∞ ÉLITE GLOBAL* 💎🏁'


    user.role = role
    return true
}

export default handler */
