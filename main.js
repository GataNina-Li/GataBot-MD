process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1'
import './config.js' 
import './plugins/_content.js'
import { createRequire } from 'module'
import path, { join } from 'path'
import {fileURLToPath, pathToFileURL} from 'url'
import { platform } from 'process'
import * as ws from 'ws'
import fs, { writeFileSync, readdirSync, statSync, unlinkSync, existsSync, readFileSync, copyFileSync, watch, rmSync, readdir, stat, mkdirSync, rename, writeFile } from 'fs'
import yargs from 'yargs'
import { spawn } from 'child_process'
import lodash from 'lodash'
import chalk from 'chalk'
import { watchFile, unwatchFile } from 'fs'  
import syntaxerror from 'syntax-error'
import { tmpdir } from 'os'
import { format } from 'util'
import P from 'pino'
import pino from 'pino'
import Pino from 'pino'
import { Boom } from '@hapi/boom'
import { makeWASocket, protoType, serialize } from './lib/simple.js'
import {Low, JSONFile} from 'lowdb'
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js'
import store from './lib/store.js'
import readline from 'readline'
import NodeCache from 'node-cache'
const { DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC } = await import('@whiskeysockets/baileys')
const { CONNECTING } = ws
const { chain } = lodash
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000

protoType()
serialize()

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
}; global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '')
global.timestamp = { start: new Date }

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®&.\\-.@').replace(/[|\\{}()[\]^$+*.\-\^]/g, '\\$&') + ']');

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
if (global.db.READ) {
return new Promise((resolve) => setInterval(async function() {
if (!global.db.READ) {
clearInterval(this);
resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
}}, 1 * 1000));
}
if (global.db.data !== null) return;
global.db.READ = true;
await global.db.read().catch(console.error);
global.db.READ = null;
global.db.data = {
users: {},
chats: {},
stats: {},
msgs: {},
sticker: {},
settings: {},
...(global.db.data || {}),
};
global.db.chain = chain(global.db.data);
};
loadDatabase();

// Inicialización de conexiones globales
/*if (global.conns instanceof Array) {
console.log('Conexiones ya inicializadas...');
} else {
global.conns = [];
}*/

/* ------------------------------------------------*/

global.chatgpt = new Low(new JSONFile(path.join(__dirname, '/db/chatgpt.json')));
global.loadChatgptDB = async function loadChatgptDB() {
if (global.chatgpt.READ) {
return new Promise((resolve) =>
setInterval(async function() {
if (!global.chatgpt.READ) {
clearInterval(this);
resolve( global.chatgpt.data === null ? global.loadChatgptDB() : global.chatgpt.data );
}}, 1 * 1000));
}
if (global.chatgpt.data !== null) return;
global.chatgpt.READ = true;
await global.chatgpt.read().catch(console.error);
global.chatgpt.READ = null;
global.chatgpt.data = {
users: {},
...(global.chatgpt.data || {}),
};
global.chatgpt.chain = lodash.chain(global.chatgpt.data);
};
loadChatgptDB()

global.creds = 'creds.json'
global.authFile = 'GataBotSession'
global.authFileJB  = 'GataJadiBot'
global.rutaBot = join(__dirname, authFile)
global.rutaJadiBot = join(__dirname, authFileJB)
global.authFolderRespald = join(__dirname, `sesionRespaldo`)

if (!fs.existsSync(authFolderRespald)) {
fs.mkdirSync(authFolderRespald)
console.log('Carpeta sesionRespaldo creada.')
} else {
console.log('Carpeta sesionRespaldo ya existe.')
}

// ARRANQUES DE SUB BOTS 
// Créditos: https://github.com/ReyEndymion

const readJadiBotSession = fs.readdirSync(rutaJadiBot)
const dirSessions = []

for (const session of readJadiBotSession) {
const bot = path.join(rutaJadiBot, session)
dirSessions.push(bot)
}
dirSessions.push(rutaBot)

for (const botPath of dirSessions) {
const readBotPath = fs.readdirSync(botPath)
if (readBotPath.includes(creds)) {
const filePathCreds = path.join(botPath, creds)
try {
const readCreds = JSON.parse(fs.readFileSync(filePathCreds))
const userJid = readCreds && readCreds.me && readCreds.me.jid.split('@')[0]
const currentFolderName = path.basename(botPath)
const botDirRespald = path.join(global.authFolderRespald, userJid)

if (currentFolderName !== userJid && currentFolderName !== authFileJB) {
const newBotPath = path.join(path.dirname(botPath), userJid);
fs.renameSync(botPath, newBotPath)
console.log(`Carpeta renombrada desde ${currentFolderName} a ${userJid}`)
}

if (credsStatus(botPath, userJid) && validateJSON(filePathCreds)) {
backupCreds(botPath, botDirRespald)
onBots(botPath)
} else {
const readBotDirBackup = fs.readdirSync(botDirRespald)
if (readBotDirBackup.includes(creds)) {
const fileCredsResp = path.join(botDirRespald, creds)
if (backupCredsStatus(botDirRespald) && validateJSON(fileCredsResp)) {
respaldCreds(botPath, botDirRespald)
} else {
cleanupOnConnectionError(botPath, botDirRespald)
}
} else {
cleanupOnConnectionError(botPath, botDirRespald)
}
}
continue
} catch (error) {
console.log('errorInicializacion: ', error)
}
} else if (!readJadiBotSession.length) {
onBots(rutaBot)
}
}

const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile)
const msgRetryCounterMap = (MessageRetryMap) => { }
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion()

let phoneNumber = global.botNumberCode
const methodCodeQR = process.argv.includes("qr")
const methodCode = !!phoneNumber || process.argv.includes("code")
const MethodMobile = process.argv.includes("mobile")

const rl = readline.createInterface({
input: process.stdin,
output: process.stdout,
terminal: true,
})
const question = (texto) => {
rl.clearLine(rl.input, 0)
return new Promise((resolver) => {
rl.question(texto, (respuesta) => {
rl.clearLine(rl.input, 0)
resolver(respuesta.trim())
})})
}

let opcion
if (methodCodeQR) {
opcion = '1'
}
if (!methodCodeQR && !methodCode && !fs.existsSync(`./${authFile}/creds.json`)) {
do {
let lineM = '⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ ⋯ 》'
opcion = await question(`╭${lineM}  
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
╰${lineM}\n${chalk.bold.magentaBright('---> ')}`)
if (!/^[1-2]$/.test(opcion)) {
console.log(chalk.bold.redBright(mid.methodCode11(chalk)))
}} while (opcion !== '1' && opcion !== '2' || fs.existsSync(`./${authFile}/creds.json`))
}

global.conns = []
export async function onBots(folderPath) {
const { state, saveState, saveCreds } = await useMultiFileAuthState(folderPath)
const msgRetryCounterMap = (MessageRetryMap) => { }
const {version} = await fetchLatestBaileysVersion()
const logger = pino({level: 'silent'})
const storeReload = makeInMemoryStore({logger})
async function getMessage(key) {
if (storeReload) {
const msg = await storeReload.loadMessage(key?.remoteJid, key?.id)
return msg.message || proto.Message.fromObject({}) || undefined
}}

const filterStrings = [
"Q2xvc2luZyBzdGFsZSBvcGVu", // "Closing stable open"
"Q2xvc2luZyBvcGVuIHNlc3Npb24=", // "Closing open session"
"RmFpbGVkIHRvIGRlY3J5cHQ=", // "Failed to decrypt"
"U2Vzc2lvbiBlcnJvcg==", // "Session error"
"RXJyb3I6IEJhZCBNQUM=", // "Error: Bad MAC" 
"RGVjcnlwdGVkIG1lc3NhZ2U=" // "Decrypted message" 
]

console.info = () => {} 
console.debug = () => {} 
['log', 'warn', 'error'].forEach(methodName => redefineConsoleMethod(methodName, filterStrings))

const connectionOptions = {
logger: pino({ level: 'silent' }),
printQRInTerminal: opcion == '1' ? true : methodCodeQR ? true : false,
mobile: MethodMobile, 
browser: opcion == '1' ? ['GataBot-MD', 'Edge', '2.0.0'] : methodCodeQR ? ['GataBot-MD', 'Edge', '2.0.0'] : ['Ubuntu', 'Edge', '110.0.1587.56'],
auth: {
creds: state.creds,
keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
},
markOnlineOnConnect: true, 
generateHighQualityLinkPreview: true, 
syncFullHistory: true,
getMessage: async (clave) => {
let jid = jidNormalizedUser(clave.remoteJid)
let msg = await store.loadMessage(jid, clave.id)
return msg?.message || ""
},
msgRetryCounterCache, // Resolver mensajes en espera
msgRetryCounterMap, // Determinar si se debe volver a intentar enviar un mensaje o no
defaultQueryTimeoutMs: undefined,
version,  
}

global.conn = makeWASocket(connectionOptions)
if (!fs.existsSync(`./${authFile}/creds.json`)) {
if (opcion === '2' || methodCode) {
opcion = '2'
if (!conn.authState.creds.registered) {
let addNumber
if (!!phoneNumber) {
addNumber = phoneNumber.replace(/[^0-9]/g, '')
} else {
do {
phoneNumber = await question(chalk.bgBlack(chalk.bold.greenBright(mid.phNumber2(chalk))))
phoneNumber = phoneNumber.replace(/\D/g,'')
} while (!Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v)))
rl.close()
addNumber = phoneNumber.replace(/\D/g, '')

setTimeout(async () => {
let codeBot = await conn.requestPairingCode(addNumber)
codeBot = codeBot?.match(/.{1,4}/g)?.join("-") || codeBot
console.log(chalk.bold.white(chalk.bgMagenta(mid.pairingCode)), chalk.bold.white(chalk.white(codeBot)))
}, 2000)
}}}
}

if (global.conns instanceof Array) {console.log()} else {global.conns = []}
global.conn = makeWASocket(connectionOptions)
conn.isInit = false
conn.well = false
loadDatabase(global.conn);
const botJid = state.creds.me.jid.split('@')[0]
const botDirRespald = path.join(global.authFolderRespald, botJid)

if (!opts['test']) {
if (global.db) setInterval(async () => {
if (global.db.data) await global.db.write()
if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', "GataJadiBot"], tmp.forEach(filename => cp.spawn('find', [filename, '-amin', '2', '-type', 'f', '-delete'])))}, 30 * 1000)}
if (opts['server']) (await import('./server.js')).default(global.conn, PORT)

async function getMessage(key) {
if (store) {
} return {
conversation: 'SimpleBot',
}}

async function connectionUpdate(update) {  
const {connection, lastDisconnect, isNewLogin} = update
global.stopped = connection
if (isNewLogin) conn.isInit = true
const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode
if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
await global.reloadHandler(true).catch(console.error)
//console.log(await global.reloadHandler(true).catch(console.error));
global.timestamp.connect = new Date
}
if (global.db.data == null) loadDatabase()
if (update.qr != 0 && update.qr != undefined || methodCodeQR) {
if (opcion == '1' || methodCodeQR) {
console.log(chalk.bold.yellow(mid.mCodigoQR))}
}
if (connection == 'open') {
console.log(chalk.bold.greenBright(mid.mConexion))}
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode
if (connection === 'close') {
if (reason === DisconnectReason.badSession) {
console.log(chalk.bold.cyanBright(lenguajeGB['smsConexionOFF']()))
} else if (reason === DisconnectReason.connectionClosed) {
console.log(chalk.bold.magentaBright(lenguajeGB['smsConexioncerrar']()))
await global.reloadHandler(true).catch(console.error)
} else if (reason === DisconnectReason.connectionLost) {
console.log(chalk.bold.blueBright(lenguajeGB['smsConexionperdida']()))
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
await global.reloadHandler(true).catch(console.error) //process.send('reset')
} else {
console.log(chalk.bold.redBright(lenguajeGB['smsConexiondescon'](reason, connection)))
}}
}
process.on('uncaughtException', console.error);
//process.on('uncaughtException', (err) => {
//console.error('Se ha cerrado la conexión:\n', err)
//process.send('reset') })

/* ------------------------------------------------*/
/* Código reconexión de sub-bots fases beta */
/* Echo por: https://github.com/elrebelde21 */

/*async function connectSubBots() {
const subBotDirectory = './GataJadiBot';
if (!existsSync(subBotDirectory)) {
console.log('No se encontraron ningun sub-bots.');
return;
}

const subBotFolders = readdirSync(subBotDirectory).filter(file => 
statSync(join(subBotDirectory, file)).isDirectory()
);

const botPromises = subBotFolders.map(async folder => {
const authFile = join(subBotDirectory, folder);
if (existsSync(join(authFile, 'creds.json'))) {
return await connectionUpdate(authFile);
}
});

const bots = await Promise.all(botPromises);
global.conns = bots.filter(Boolean);
console.log(chalk.bold.greenBright(`✅ TODOS LOS SUB-BOTS SE HAN INICIADO CORRECTAMENTE`))
}

(async () => {
global.conns = [];

const mainBotAuthFile = 'GataBotSession';
try {
const mainBot = await connectionUpdate(mainBotAuthFile);
global.conns.push(mainBot);
console.log(chalk.bold.greenBright(`✅ BOT PRINCIPAL INICIANDO CORRECTAMENTE`))

await connectSubBots();
} catch (error) {
console.error(chalk.bold.cyanBright(`❌ OCURRIÓ UN ERROR AL INICIAR EL BOT PRINCIPAL: `, error))
}
})();*/

/* ------------------------------------------------*/

let isInit = true
let handler = await import('./handler.js');
global.reloadHandler = async function(restatConn) {
try {
const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
if (Object.keys(Handler || {}).length) handler = Handler;
} catch (e) {
console.error(e);
}
if (restatConn) {
const oldChats = global.conn.chats;
try {
global.conn.ws.close();
} catch { }
conn.ev.removeAllListeners();
global.conn = makeWASocket(connectionOptions, {chats: oldChats});
isInit = true;
}
if (!isInit) {
conn.ev.off('messages.upsert', conn.handler);
conn.ev.off('group-participants.update', conn.participantsUpdate);
conn.ev.off('groups.update', conn.groupsUpdate);
conn.ev.off('message.delete', conn.onDelete);
conn.ev.off('call', conn.onCall);
conn.ev.off('connection.update', conn.connectionUpdate);
conn.ev.off('creds.update', conn.credsUpdate);
}

//Información para Grupos
conn.welcome = lenguajeGB['smsWelcome']() 
conn.bye = lenguajeGB['smsBye']() 
conn.spromote = lenguajeGB['smsSpromote']() 
conn.sdemote = lenguajeGB['smsSdemote']() 
conn.sDesc = lenguajeGB['smsSdesc']() 
conn.sSubject = lenguajeGB['smsSsubject']() 
conn.sIcon = lenguajeGB['smsSicon']() 
conn.sRevoke = lenguajeGB['smsSrevoke']() 

conn.handler = handler.handler.bind(global.conn);
conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
conn.onDelete = handler.deleteUpdate.bind(global.conn);
conn.onCall = handler.callUpdate.bind(global.conn);
conn.connectionUpdate = connectionUpdate.bind(global.conn);
conn.credsUpdate = saveCreds.bind(global.conn, true);

conn.ev.on('messages.upsert', conn.handler);
conn.ev.on('group-participants.update', conn.participantsUpdate);
conn.ev.on('groups.update', conn.groupsUpdate);
conn.ev.on('message.delete', conn.onDelete);
conn.ev.on('call', conn.onCall);
conn.ev.on('connection.update', conn.connectionUpdate);
conn.ev.on('creds.update', conn.credsUpdate);
isInit = false
return true
}

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
try {
const file = global.__filename(join(pluginFolder, filename));
const module = await import(file);
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(e);
delete global.plugins[filename];
}}}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error)

global.reload = async (_ev, filename) => {
if (pluginFilter(filename)) {
const dir = global.__filename(join(pluginFolder, filename), true)
if (filename in global.plugins) {
if (existsSync(dir)) conn.logger.info(` SE ACTULIZADO - '${filename}' CON ÉXITO`)
else {
conn.logger.warn(`SE ELIMINO UN ARCHIVO : '${filename}'`)
return delete global.plugins[filename];
}
} else conn.logger.info(`SE DETECTO UN NUEVO PLUGINS : '${filename}'`)
const err = syntaxerror(readFileSync(dir), filename, {
sourceType: 'module',
allowAwaitOutsideFunction: true,
});
if (err) conn.logger.error(`SE DETECTO UN ERROR DE SINTAXIS | SYNTAX ERROR WHILE LOADING '${filename}'\n${format(err)}`);
else {
try {
const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
global.plugins[filename] = module.default || module;
} catch (e) {
conn.logger.error(`HAY UN ERROR REQUIERE EL PLUGINS '${filename}\n${format(e)}'`);
} finally {
global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
}}}};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();
async function _quickTest() {
const test = await Promise.all([
spawn('ffmpeg'),
spawn('ffprobe'),
spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
spawn('convert'),
spawn('magick'),
spawn('gm'),
spawn('find', ['--version']),
].map((p) => {
return Promise.race([
new Promise((resolve) => {
p.on('close', (code) => {
resolve(code !== 127);
});
}),
new Promise((resolve) => {
p.on('error', (_) => resolve(false));
})]);
}));
const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
Object.freeze(global.support);
}

function clearTmp() {
const tmpDir = join(__dirname, 'tmp')
const filenames = readdirSync(tmpDir)
filenames.forEach(file => {
const filePath = join(tmpDir, file)
unlinkSync(filePath)})
}

function purgeSession() {
let prekey = []
let directorio = readdirSync("./GataBotSession")
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-')
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./GataBotSession/${files}`)
})
} 

function purgeSessionSB() {
try {
const listaDirectorios = readdirSync('./GataJadiBot/');
let SBprekey = [];
listaDirectorios.forEach(directorio => {
if (statSync(`./GataJadiBot/${directorio}`).isDirectory()) {
const DSBPreKeys = readdirSync(`./GataJadiBot/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-')
})
SBprekey = [...SBprekey, ...DSBPreKeys];
DSBPreKeys.forEach(fileInDir => {
if (fileInDir !== 'creds.json') {
unlinkSync(`./GataJadiBot/${directorio}/${fileInDir}`)
}})
}})
if (SBprekey.length === 0) {
console.log(chalk.bold.green(lenguajeGB.smspurgeSessionSB1()))
} else {
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeSessionSB2()))
}} catch (err) {
console.log(chalk.bold.red(lenguajeGB.smspurgeSessionSB3() + err))
}}

function purgeOldFiles() {
const directories = ['./GataBotSession/', './GataJadiBot/']
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
if (file !== 'creds.json') {
const filePath = path.join(dir, file);
unlinkSync(filePath, err => {
if (err) {
console.log(chalk.bold.red(`${lenguajeGB.smspurgeOldFiles3()} ${file} ${lenguajeGB.smspurgeOldFiles4()}` + err))
} else {
console.log(chalk.bold.green(`${lenguajeGB.smspurgeOldFiles1()} ${file} ${lenguajeGB.smspurgeOldFiles2()}`))
} }) }
}) }) }) }

function redefineConsoleMethod(methodName, filterStrings) {
const originalConsoleMethod = console[methodName]
console[methodName] = function() {
const message = arguments[0]
if (typeof message === 'string' && filterStrings.some(filterString => message.includes(atob(filterString)))) {
arguments[0] = ""
}
originalConsoleMethod.apply(console, arguments)
}}

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await clearTmp()
console.log(chalk.bold.cyanBright(lenguajeGB.smsClearTmp()))}, 1000 * 60 * 4) // 4 min 

//setInterval(async () => {
//if (stopped === 'close' || !conn || !conn.user) return
//await purgeSession()
//console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeSession()))}, 1000 * 60 * 10) // 10 min

//setInterval(async () => {
//if (stopped === 'close' || !conn || !conn.user) return
//await purgeSessionSB()}, 1000 * 60 * 10) 

setInterval(async () => {
if (stopped === 'close' || !conn || !conn.user) return
await purgeOldFiles()
console.log(chalk.bold.cyanBright(lenguajeGB.smspurgeOldFiles()))}, 1000 * 60 * 10)

function validateJSON(filePath) {
let statsCreds = fs.statSync(filePath)
if (statsCreds && statsCreds.size !== 0) {
try {
const data = fs.readFileSync(filePath, 'utf8');
let readCreds = JSON.parse(data)
if (readCreds && readCreds.me && readCreds.me.jid && readCreds.hasOwnProperty('platform')) {
console.log(`El archivo JSON de la carpeta ${filePath} es válido.`)
return true
}
} catch (error) {
console.error('Error de sintaxis en JSON:', error.message);
return false
}
} else {
console.log(`El archivo JSON de la carpeta ${filePath} es inválido.`)
}
}

async function backupCreds(pathSession, pathBackUp) {
if (!fs.existsSync(pathBackUp)) {
fs.mkdirSync(pathBackUp)
console.log(`Directorio del backup ${pathBackUp} creado exitosamente'`)
}
const credsFilePath = path.join(pathSession, creds)
const backupFilePath = path.join(pathBackUp, creds)
copyFileSync(credsFilePath, backupFilePath)
console.log(`Creado el archivo de respaldo: ${backupFilePath}`)
}

async function credsStatus(pathSession, userJid) {
try {
const filesSession = fs.readdirSync(pathSession)
if (filesSession.includes(creds)) {
const credsFilePath = path.join(pathSession, creds)
const statsCreds = fs.statSync(credsFilePath)
if (statsCreds && statsCreds.size !== 0) {
try {
const readCreds = JSON.parse(fs.readFileSync(credsFilePath))
if (readCreds && readCreds.me && readCreds.me.jid && readCreds.hasOwnProperty('platform')) {
return `Archivo creds correcto para ${userJid}. Se realizó un backup.`, true
} else {
return `El Archivo de sesion de ${userJid} no contiene las propiedades correctas, debe ejecutar un respaldo inmediatamente desde la sesion principal o borrar la sesion`, false
}
} catch (error) {
return `El Archivo de sesion de ${userJid} no se puede leer en este momento o es ilegible, estos son los detalles actualmente:\n\n${error.stack}`, false
}
} else {
return `El Archivo de sesion de ${userJid} es incorrecto y tiene 0 bytes, debe ejecutar un respaldo inmediatamente desde la sesion principal o borrar la sesion`, false
}
} else {
return `El Archivo de sesion de ${userJid} no existe en la ubicacion esparada, debe ejecutar un respaldo inmediatamente desde la sesion principal o borrar la sesion`, false
}
} catch (error) {
return console.log('credsStatusError: ', error)
}}

function backupCredsStatus(pathBackUp) {
if (existsSync(pathBackUp)) {
const readDirRespald = fs.readdirSync(pathBackUp)
if (readDirRespald.includes(creds)) {
const backupFilePath = path.join(pathBackUp, creds)
const statBackUpCreds = fs.statSync(backupFilePath)
if (statBackUpCreds.size !== 0) {
try {
const readCredsResp = JSON.parse(fs.readFileSync(backupFilePath));
if (readCredsResp && readCredsResp.me && readCredsResp.me.jid && readCredsResp.hasOwnProperty('platform')) {
return 'Archivo de respaldo es correcto, puede respaldar la sesion si gusta', true
} else {
return 'Archivo de respaldo no contiene las propiedades correctas, debe ejecutar un respaldo inmediatamente desde la sesion principal o borrar la sesion', false
}
} catch (error) {
return `El Archivo de respaldo no se puede leer en este momento o es ilegible, estos son los detalles actualmente:\n\n${error.stack}`, false
}
} else {
return 'Archivo de respaldo es incorrecto y tiene 0 bytes, debe ejecutar un respaldo inmediatamente desde la sesion principal o borrar la sesion', false
}
} else {
return 'Archivo de respaldo no existe en la ubicacion esparada, debe ejecutar un respaldo inmediatamente desde la sesion principal o borrar la sesion', false
}
} else {
return 'La carpeta Backup de credenciales no existe, debe realizar un respaldo desde el archivo original', false
}}

function cleanupOnConnectionError(pathSession, pathBackUp) {
readdirSync(pathSession).forEach(file => {
const credsFilePath = path.join(pathSession, file);
try {
rmSync(pathSession, { recursive: true, force: true });
console.log(`Archivo eliminado: ${credsFilePath}`)
} catch (error) {
console.log(`No se pudo eliminar el archivo: ${credsFilePath}`)
}
});
const backupFilePath = path.join(pathBackUp, creds);
try {
rmSync(pathBackUp, { recursive: true, force: true });
console.log(`Archivo de copia de seguridad eliminado: ${backupFilePath}`)
} catch (error) {
console.log(`No se pudo eliminar el archivo de copia de seguridad o no existe: ${backupFilePath}`)
}
process.send('reset')
}

global.cleanFolders = async function limpCarpetas() {
const directories = [rutaJadiBot, authFolderRespald]
try {
directories.forEach((dir) => {
const files = readdirSync(dir, { recursive: true });
files.forEach((file) => {
const filePath = path.join(dir, file)
const stats = statSync(filePath)
const tiempoTranscurrido = Date.now() - stats.mtimeMs

if ( dir === rutaJadiBot || dir === authFolderRespald ) {
if (stats.isDirectory()) {
const contenidoCarpeta = readdirSync(filePath)

if (contenidoCarpeta.length === 0) {
rmSync(filePath, { recursive: true, force: true })
console.log( `Carpeta ${filePath} eliminada.`)
if (filePath.startsWith(authFolderAniMX)) {
process.send('reset')
}} else {
if (tiempoTranscurrido > 15 * 24 * 60 * 60 * 1000) {
rmSync(filePath, { recursive: true, force: true })
console.log(`Carpeta ${filePath} eliminada.`)
}}}} 
//else if (dir === dataBases ) {
//if (stats.isDirectory()) {
//if (tiempoTranscurrido > 15 * 24 * 60 * 60 * 1000) {
// rmSync(filePath, { recursive: true, force: true });
//console.log(`Carpeta ${filePath} eliminada.`);
//}}
}
})
})
} catch (error) {
console.error(`Error al eliminar directorios:\n\n${error}`)
}}
setInterval(async () => {
global.cleanFolders()
console.log(chalk.cyanBright(`\n▣────────[ LIMPIAR CARPETAS ]───────────···\n│\n▣─❧ CARPETAS VACIAS Y ANTIGUAS ELIMINADAS ✅\n│\n▣────────────────────────────────────···\n`))
}, 30 * 10000)

_quickTest().then(() => conn.logger.info(chalk.bold(lenguajeGB['smsCargando']().trim()))).catch(console.error)

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
unwatchFile(file)
console.log(chalk.bold.greenBright(lenguajeGB['smsMainBot']().trim()))
import(`${file}?update=${Date.now()}`)
})
