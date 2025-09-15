process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js'
import './plugins/_content.js'
import { createRequire } from 'module'
import path, { join } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, {
  watchFile,
  unwatchFile,
  readdirSync,
  existsSync,
  readFileSync
} from 'fs'
import * as fsPromises from 'fs/promises'
import { readdir, stat, unlink } from 'fs/promises'
import yargs from 'yargs'
import lodash from 'lodash'
import chalk from 'chalk'
import syntaxerror from 'syntax-error'
import { format } from 'util'
import pino from 'pino'
import Pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import Datastore from '@seald-io/nedb'
import store from './lib/store.js'
import readline from 'readline'
import NodeCache from 'node-cache'
import { gataJadiBot } from './plugins/jadibot-serbot.js'
import pkg from 'google-libphonenumber'
const { PhoneNumberUtil } = pkg
const phoneUtil = PhoneNumberUtil.getInstance()

const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeCacheableSignalKeyStore } = await import('@whiskeysockets/baileys')
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? (/file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL) : pathToFileURL(pathURL).toString()
}
global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true))
}
global.__require = function require(dir = import.meta.url) {
  return createRequire(dir)
}

global.timestamp = { start: new Date }
const __dirname = global.__dirname(import.meta.url)
global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())

const dbPath = path.join(__dirname, 'database')
if (!fs.existsSync(dbPath)) fs.mkdirSync(dbPath)

const collections = {
  users:    new Datastore({ filename: path.join(dbPath, 'users.db'),    autoload: true }),
  chats:    new Datastore({ filename: path.join(dbPath, 'chats.db'),    autoload: true }),
  settings: new Datastore({ filename: path.join(dbPath, 'settings.db'), autoload: true }),
  msgs:     new Datastore({ filename: path.join(dbPath, 'msgs.db'),     autoload: true }),
  sticker:  new Datastore({ filename: path.join(dbPath, 'sticker.db'),  autoload: true }),
  stats:    new Datastore({ filename: path.join(dbPath, 'stats.db'),    autoload: true })
}

Object.values(collections).forEach(db => db.setAutocompactionInterval(300000))

global.db = {
  data: { users: {}, chats: {}, settings: {}, msgs: {}, sticker: {}, stats: {} }
}

const sanitizeId = (id) => id.replace(/\./g, '_')
const unsanitizeId = (id) => id.replace(/_/g, '.')

const sanitizeObject = (obj) => {
  const out = {}
  for (const [k, v] of Object.entries(obj || {})) {
    const nk = k.replace(/\./g, '_')
    out[nk] = (typeof v === 'object' && v !== null) ? sanitizeObject(v) : v
  }
  return out
}
const unsanitizeObject = (obj) => {
  const out = {}
  for (const [k, v] of Object.entries(obj || {})) {
    const nk = k.replace(/_/g, '.')
    out[nk] = (typeof v === 'object' && v !== null) ? unsanitizeObject(v) : v
  }
  return out
}

global.db.readData = async function (category, id) {
  const sid = sanitizeId(id)
  if (!global.db.data[category][sid]) {
    const data = await new Promise((resolve, reject) => {
      collections[category].findOne({ _id: sid }, (err, doc) => {
        if (err) return reject(err)
        resolve(doc ? unsanitizeObject(doc.data) : {})
      })
    })
    global.db.data[category][sid] = data
  }
  return global.db.data[category][sid]
}

global.db.writeData = async function (category, id, data) {
  const sid = sanitizeId(id)
  global.db.data[category][sid] = {
    ...global.db.data[category][sid],
    ...sanitizeObject(data)
  }
  await new Promise((resolve, reject) => {
    collections[category].update(
      { _id: sid },
      { $set: { data: sanitizeObject(global.db.data[category][sid]) } },
      { upsert: true },
      (err) => (err ? reject(err) : resolve())
    )
  })
}

global.db.loadDatabase = async function () {
  const loadPromises = Object.keys(collections).map(async (category) => {
    const docs = await new Promise((resolve, reject) => {
      collections[category].find({}, (err, docs) => (err ? reject(err) : resolve(docs)))
    })
    const seenIds = new Set()
    for (const doc of docs) {
      const originalId = unsanitizeId(doc._id)
      if (seenIds.has(originalId)) {
        await new Promise((resolve, reject) => {
          collections[category].remove({ _id: doc._id }, {}, (err) => (err ? reject(err) : resolve()))
        })
        continue
      }
      seenIds.add(originalId)
      if (category === 'users' && (originalId.includes('@newsletter') || originalId.includes('lid'))) continue
      if (category === 'chats' && originalId.includes('@newsletter')) continue
      global.db.data[category][originalId] = unsanitizeObject(doc.data)
    }
  })
  await Promise.all(loadPromises)
}

global.db.save = async function () {
  const tasks = []
  for (const category of Object.keys(global.db.data)) {
    for (const [id, data] of Object.entries(global.db.data[category])) {
      if (!Object.keys(data).length) continue
      if (category === 'users' && (id.includes('@newsletter') || id.includes('lid'))) continue
      if (category === 'chats' && id.includes('@newsletter')) continue
      tasks.push(new Promise((resolve, reject) => {
        collections[category].update(
          { _id: sanitizeId(id) },
          { $set: { data: sanitizeObject(data) } },
          { upsert: true },
          (err) => (err ? reject(err) : resolve())
        )
      }))
    }
  }
  await Promise.all(tasks)
}

global.db.loadDatabase()
  .then(() => console.log('Base de datos lista'))
  .catch(err => console.error('Error cargando base de datos:', err))

async function gracefulShutdown () {
  await global.db.save()
  console.log('Guardando base de datos antes de cerrar...')
  process.exit(0)
}
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)

global.creds = 'creds.json'
global.authFile = 'GataBotSession'
global.authFileJB = 'GataJadiBot'
global.rutaBot = join(__dirname, global.authFile)
global.rutaJadiBot = join(__dirname, global.authFileJB)
const respaldoDir = join(__dirname, 'BackupSession')
const credsFile = join(global.rutaBot, global.creds)
if (!existsSync(global.rutaJadiBot)) fs.mkdirSync(global.rutaJadiBot, { recursive: true })
if (!existsSync(respaldoDir)) fs.mkdirSync(respaldoDir, { recursive: true })

const { state, saveCreds } = await useMultiFileAuthState(global.authFile)
const msgRetryCounterCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const userDevicesCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
const { version } = await fetchLatestBaileysVersion()

let phoneNumber = global.botNumberCode
const methodCodeQR = process.argv.includes('qr')
const methodCode  = !!phoneNumber || process.argv.includes('code')
const MethodMobile = process.argv.includes('mobile')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
const question = (texto) => new Promise((resolve) => rl.question(texto, (r) => resolve(r.trim())))
let opcion
if (methodCodeQR) opcion = '1'

if (!methodCodeQR && !methodCode && !existsSync(`./${global.authFile}/creds.json`)) {
  do {
    const lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
    opcion = await question(
`╭${lineM}
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('┊')} ${chalk.blue.bgBlue.bold.cyan(mid.methodCode1)}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('┊')} ${chalk.green.bgMagenta.bold.yellow(mid.methodCode2)}
┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright(`⇢  ${mid.methodCode3} 1:`)} ${chalk.greenBright(mid.methodCode4)}
┊ ${chalk.blueBright('┊')} ${chalk.bold.redBright(`⇢  ${mid.methodCode3} 2:`)} ${chalk.greenBright(mid.methodCode5)}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta(mid.methodCode6)}
┊ ${chalk.blueBright('┊')} ${chalk.italic.magenta(mid.methodCode7)}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('╭┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
┊ ${chalk.blueBright('┊')} ${chalk.red.bgRed.bold.green(mid.methodCode8)}
┊ ${chalk.blueBright('┊')} ${chalk.italic.cyan(mid.methodCode9)}
┊ ${chalk.blueBright('┊')} ${chalk.italic.cyan(mid.methodCode10)}
┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm run qr ${chalk.italic.magenta(`(${mid.methodCode12})`)}`)}
┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm run code ${chalk.italic.magenta(`(${mid.methodCode13})`)}`)}
┊ ${chalk.blueBright('┊')} ${chalk.bold.yellow(`npm start ${chalk.italic.magenta(`(${mid.methodCode14})`)}`)}
┊ ${chalk.blueBright('╰┅┅┅┅┅┅┅┅┅┅┅┅┅┅┅')}
╰${lineM}
${chalk.bold.magentaBright('---> ')}`)
    if (!/^[1-2]$/.test(opcion)) console.log(chalk.bold.redBright(mid.methodCode11(chalk)))
  } while (opcion !== '1' && opcion !== '2' || existsSync(`./${global.authFile}/creds.json`))
}


const filterStringsBase64 = [
  'Q2xvc2luZyBzdGFsZSBvcGVu',          // "Closing stable open"
  'Q2xvc2luZyBvcGVuIHNlc3Npb24=',      // "Closing open session"
  'RmFpbGVkIHRvIGRlY3J5cHQ=',          // "Failed to decrypt"
  'U2Vzc2lvbiBlcnJvcg==',              // "Session error"
  'RXJyb3I6IEJhZCBNQUM=',              // "Error: Bad MAC"
  'RGVjcnlwdGVkIG1lc3NhZ2U='           // "Decrypted message"
]
const filterStrings = filterStringsBase64.map(s => Buffer.from(s, 'base64').toString('utf8'))
function redefineConsoleMethod(methodName, filters) {
  const original = console[methodName]
  console[methodName] = function () {
    const msg = arguments[0]
    if (typeof msg === 'string' && filters.some(f => msg.includes(f))) arguments[0] = ''
    return original.apply(console, arguments)
  }
}
console.info = () => {}
console.debug = () => {}
;['log', 'warn', 'error'].forEach(m => redefineConsoleMethod(m, filterStrings))


const connectionOptions = {
  logger: pino({ level: 'silent' }),
  printQRInTerminal: opcion === '1' ? true : methodCodeQR ? true : false,
  mobile: MethodMobile,
  browser: opcion === '1' ? ['GataBot-MD', 'Edge', '20.0.04'] : methodCodeQR ? ['GataBot-MD', 'Edge', '20.0.04'] : ['Ubuntu', 'Chrome', '20.0.04'],
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: 'fatal' }).child({ level: 'fatal' }))
  },
  markOnlineOnConnect: false,
  generateHighQualityLinkPreview: true,
  syncFullHistory: false,
  getMessage: async (key) => {
    try {
      const jid = key.remoteJid
      const msg = await store.loadMessage(jid, key.id)
      return msg?.message || ''
    } catch { return '' }
  },
  msgRetryCounterCache,
  userDevicesCache,
  defaultQueryTimeoutMs: undefined,
  cachedGroupMetadata: (jid) => global.conn?.chats?.[jid] ?? {},
  version,
  keepAliveIntervalMs: 55000,
  maxIdleTimeMs: 60000
}

global.conn = makeWASocket(connectionOptions)
const conn = global.conn


if (!existsSync(`./${global.authFile}/creds.json`)) {
  if (opcion === '2' || methodCode) {
    opcion = '2'
    if (!conn.authState.creds.registered) {
      let addNumber
      if (!!phoneNumber) {
        addNumber = phoneNumber.replace(/[^0-9]/g, '')
      } else {
        do {
          phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(mid.phNumber2(chalk))))
          phoneNumber = phoneNumber.replace(/\D/g, '')
          if (!phoneNumber.startsWith('+')) phoneNumber = `+${phoneNumber}`
        } while (!await isValidPhoneNumber(phoneNumber))
        rl.close()
        addNumber = phoneNumber.replace(/\D/g, '')
        setTimeout(async () => {
          let codeBot = await conn.requestPairingCode(addNumber)
          codeBot = codeBot?.match(/.{1,4}/g)?.join('-') || codeBot
          console.log(chalk.bold.white(chalk.bgMagenta(mid.pairingCode)), chalk.bold.white(codeBot))
        }, 2000)
      }
    }
  }
}

conn.isInit = false
conn.well = false


if (!opts['test']) {
  if (global.db) setInterval(async () => { if (global.db.data) await global.db.save() }, 30_000).unref()
}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT)

const backupCreds = async () => {
  if (!existsSync(credsFile)) {
    console.log('[⚠] No se encontró creds.json para respaldar.')
    return
  }
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const newBackup = join(respaldoDir, `creds-${timestamp}.json`)
  await fsPromises.copyFile(credsFile, newBackup)
  const backups = (await fsPromises.readdir(respaldoDir))
    .filter(f => f.startsWith('creds-') && f.endsWith('.json'))
    .sort((a, b) => fs.statSync(join(respaldoDir, a)).mtimeMs - fs.statSync(join(respaldoDir, b)).mtimeMs)
  while (backups.length > 3) {
    const oldest = backups.shift()
    await fsPromises.unlink(join(respaldoDir, oldest))
  }
}

const restoreCreds = async () => {
  const backups = (await fsPromises.readdir(respaldoDir))
    .filter(f => f.startsWith('creds-') && f.endsWith('.json'))
    .sort((a, b) => fs.statSync(join(respaldoDir, b)).mtimeMs - fs.statSync(join(respaldoDir, a)).mtimeMs)
  if (!backups.length) return console.log('[⚠] No hay respaldos disponibles.')
  await fsPromises.copyFile(join(respaldoDir, backups[0]), credsFile)
  console.log(`[✅] Restaurado desde respaldo: ${backups[0]}`)
}

setInterval(async () => {
  await backupCreds()
  console.log('[♻️] Respaldo periódico realizado.')
}, 5 * 60_000).unref()

async function connectionUpdate (update) {
  const { connection, lastDisconnect, isNewLogin, qr } = update
  global.stopped = connection
  if (isNewLogin) conn.isInit = true

  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error)
    global.timestamp.connect = new Date
  }

  if (qr != 0 && qr != undefined || methodCodeQR) {
    if (opcion === '1' || methodCodeQR) console.log(chalk.bold.yellow(mid.mCodigoQR))
  }

  if (connection === 'open') {
    console.log(chalk.bold.greenBright(mid.mConexion))
    await joinChannels(conn)
  }

  const reason = new Boom(lastDisconnect?.error)?.output?.statusCode
  if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
      console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionOFF']()))
    } else if (reason === DisconnectReason.connectionClosed) {
      console.log(chalk.bold.magentaBright(lenguajeGB['smsConexioncerrar']()))
      await restoreCreds()
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionLost) {
      console.log(chalk.bold.blueBright(lenguajeGB['smsConexionperdida']()))
      await restoreCreds()
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.connectionReplaced) {
      console.log(chalk.bold.yellowBright(lenguajeGB['smsConexionreem']()))
    } else if (reason === DisconnectReason.loggedOut) {
      console.log(chalk.bold.redBright(lenguajeGB['smsConexionOFF']()))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.restartRequired) {
      console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionreinicio']()))
      await global.reloadHandler(true).catch(console.error)
    } else if (reason === DisconnectReason.timedOut) {
      console.log(chalk.bold.yellowBright(lenguajeGB['smsConexiontiem']()))
      await global.reloadHandler(true).catch(console.error)
    } else {
      console.log(chalk.bold.redBright(lenguajeGB['smsConexiondescon'](reason, connection)))
    }
  }
}
process.on('uncaughtException', console.error)

let isInit = true
let handler = await import('./handler.js')

global.reloadHandler = async function (restartConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error)
    if (Object.keys(Handler || {}).length) handler = Handler
  } catch (e) { console.error(e) }

  if (restartConn) {
    const oldChats = global.conn.chats
    try { global.conn.ws.close() } catch {}
    conn.ev.removeAllListeners()
    global.conn = makeWASocket(connectionOptions, { chats: oldChats })
  }

  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler)
    conn.ev.off('group-participants.update', conn.participantsUpdate)
    conn.ev.off('groups.update', conn.groupsUpdate)
    conn.ev.off('message.delete', conn.onDelete)
    conn.ev.off('call', conn.onCall)
    conn.ev.off('connection.update', conn.connectionUpdate)
    conn.ev.off('creds.update', conn.credsUpdate)
  }

  // Textos de grupos
  conn.welcome   = lenguajeGB['smsWelcome']()
  conn.bye       = lenguajeGB['smsBye']()
  conn.spromote  = lenguajeGB['smsSpromote']()
  conn.sdemote   = lenguajeGB['smsSdemote']()
  conn.sDesc     = lenguajeGB['smsSdesc']()
  conn.sSubject  = lenguajeGB['smsSsubject']()
  conn.sIcon     = lenguajeGB['smsSicon']()
  conn.sRevoke   = lenguajeGB['smsSrevoke']()

  conn.handler            = handler.handler.bind(global.conn)
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn)
  conn.groupsUpdate       = handler.groupsUpdate.bind(global.conn)
  conn.onDelete           = handler.deleteUpdate.bind(global.conn)
  conn.onCall             = handler.callUpdate.bind(global.conn)
  conn.connectionUpdate   = connectionUpdate.bind(global.conn)
  conn.credsUpdate        = saveCreds.bind(global.conn, true)

  conn.ev.on('messages.upsert', conn.handler)
  conn.ev.on('group-participants.update', conn.participantsUpdate)
  conn.ev.on('groups.update', conn.groupsUpdate)
  conn.ev.on('message.delete', conn.onDelete)
  conn.ev.on('call', conn.onCall)
  conn.ev.on('connection.update', conn.connectionUpdate)
  conn.ev.on('creds.update', conn.credsUpdate)

  isInit = false
  return true
}

if (global.gataJadibts) {
  const readRutaJadiBot = fs.readdirSync(global.rutaJadiBot)
  if (readRutaJadiBot.length > 0) {
    const creds = 'creds.json'
    for (const gjbts of readRutaJadiBot) {
      const botPath = path.join(global.rutaJadiBot, gjbts)
      if (fs.lstatSync(botPath).isDirectory()) {
        const readBotPath = fs.readdirSync(botPath)
        if (readBotPath.includes(creds)) {
          gataJadiBot({
            pathGataJadiBot: botPath,
            m: null,
            conn,
            args: '',
            usedPrefix: '/',
            command: 'serbot'
          })
        }
      }
    }
  }
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'))
const pluginFilter = (filename) => /\.js$/.test(filename)
global.plugins = {}

async function filesInit () {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename))
      const module = await import(file)
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(e)
      delete global.plugins[filename]
    }
  }
}
filesInit().then(() => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
  if (!pluginFilter(filename)) return
  const dir = global.__filename(join(pluginFolder, filename), true)
  if (filename in global.plugins) {
    if (existsSync(dir)) conn.logger.info(`SE ACTUALIZÓ: '${filename}'`)
    else {
      conn.logger.warn(`SE ELIMINÓ: '${filename}'`)
      delete global.plugins[filename]
      return
    }
  } else conn.logger.info(`NUEVO PLUGIN: '${filename}'`)

  const err = syntaxerror(readFileSync(dir), filename, { sourceType: 'module', allowAwaitOutsideFunction: true })
  if (err) conn.logger.error(`SYNTAX ERROR '${filename}'\n${format(err)}`)
  else {
    try {
      const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`))
      global.plugins[filename] = module.default || module
    } catch (e) {
      conn.logger.error(`ERROR REQUIRIENDO '${filename}'\n${format(e)}`)
    } finally {
      global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)))
    }
  }
}
fs.watch(pluginFolder, global.reload)
await global.reloadHandler()

import { spawn } from 'child_process'
async function _quickTest () {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version'])
  ].map((p) =>
    Promise.race([
      new Promise((resolve) => p.on('close', (code) => resolve(code !== 127))),
      new Promise((resolve) => p.on('error', (_) => resolve(false)))
    ])
  ))
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test
  const s = global.support = { ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find }
  Object.freeze(global.support)
}

function clearTmp () {
  const tmpDir = join(__dirname, 'tmp')
  if (!existsSync(tmpDir)) return
  for (const file of readdirSync(tmpDir)) {
    const filePath = join(tmpDir, file)
    fs.unlinkSync(filePath)
  }
}

async function purgeSession () {
  const sessionDir = './GataBotSession'
  try {
    if (!existsSync(sessionDir)) return
    const files = await readdir(sessionDir)
    const preKeys = files.filter(f => f.startsWith('pre-key-'))
    const now = Date.now()
    const oneDayAgo = now - (24 * 60 * 60 * 1000)
    for (const file of preKeys) {
      const fp = join(sessionDir, file)
      const stt = await stat(fp)
      if (stt.mtimeMs < oneDayAgo) {
        try { await unlink(fp) } catch {}
      }
    }
  } catch {}
}

async function purgeSessionSB () {
  const jadibtsDir = './GataJadiBot/'
  try {
    if (!existsSync(jadibtsDir)) return
    const directories = await readdir(jadibtsDir)
    const now = Date.now()
    const oneDayAgo = now - (24 * 60 * 60 * 1000)
    for (const dir of directories) {
      const dirPath = join(jadibtsDir, dir)
      const stats = await stat(dirPath)
      if (!stats.isDirectory()) continue
      const files = await readdir(dirPath)
      const preKeys = files.filter(f => f.startsWith('pre-key-') && f !== 'creds.json')
      for (const file of preKeys) {
        const fp = join(dirPath, file)
        const stt = await stat(fp)
        if (stt.mtimeMs < oneDayAgo) {
          try { await unlink(fp) } catch {}
        }
      }
    }
  } catch (err) {
    console.log(chalk.bold.red(lenguajeGB.smspurgeSessionSB3() + err))
  }
}

async function purgeOldFiles () {
  const directories = ['./GataBotSession/', './GataJadiBot/']
  for (const dir of directories) {
    try {
      if (!existsSync(dir)) continue
      const files = await fsPromises.readdir(dir)
      for (const f of files) {
        if (f === 'creds.json') continue
        const fp = join(dir, f)
        try { await fsPromises.unlink(fp) } catch {}
      }
    } catch {}
  }
}

setInterval(async () => {
  if (global.stopped === 'close' || !conn || !conn.user) return
  clearTmp()
  console.log(chalk.bold.cyanBright(lenguajeGB.smsClearTmp()))
}, 3 * 60_000).unref()

setInterval(async () => {
  if (global.stopped === 'close' || !conn || !conn.user) return
  await purgeSessionSB()
  await purgeSession()
  console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeSession()))
  await purgeOldFiles()
  console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeOldFiles()))
}, 10 * 60_000).unref()

_quickTest()
  .then(() => conn.logger.info(chalk.bold(lenguajeGB['smsCargando']().trim())))
  .catch(console.error)

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  console.log(chalk.bold.greenBright(lenguajeGB['smsMainBot']().trim()))
  import(`${file}?update=${Date.now()}`)
})

async function isValidPhoneNumber (number) {
  try {
    number = number.replace(/\s+/g, '')
    if (number.startsWith('+521')) number = number.replace('+521', '+52')
    else if (number.startsWith('+52') && number[4] === '1') number = number.replace('+52 1', '+52')
    const parsed = phoneUtil.parseAndKeepRawInput(number)
    return phoneUtil.isValidNumber(parsed)
  } catch { return false }
}

async function joinChannels (conn) {
  for (const channelId of Object.values(global.ch || {})) {
    await conn.newsletterFollow(channelId).catch(() => {})
  }
}
