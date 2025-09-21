#!/usr/bin/env node
import { readdir, readFile, stat, writeFile } from 'fs/promises'
import path from 'path'
import process from 'process'

const args = process.argv.slice(2)
const dir = args.find(a => !a.startsWith('--')) || process.cwd()
const dry = args.includes('--dry') || args.includes('-d')
const skipDirs = new Set(['node_modules', '.git'])
let modifiedFiles = []

// Thanks to AzamiJs
async function walk(dirPath, cb) {
const entries = await readdir(dirPath, { withFileTypes: true })
for (const e of entries) {
if (e.isDirectory()) {
if (skipDirs.has(e.name)) continue
await walk(path.join(dirPath, e.name), cb)
} else {
await cb(path.join(dirPath, e.name))
}
}
}

function scanLineForStateTransitions(line, state) {
let esc = false
for (let i = 0; i < line.length; i++) {
const ch = line[i]
if (state.inBlockComment) {
if (ch === '*' && line[i + 1] === '/') {
state.inBlockComment = false
i++
esc = false
continue
}
continue
}
if (state.inBacktick) {
if (!esc && ch === '`') {
        state.inBacktick = false
      } else if (!esc && ch === '\\') {
        esc = true
        continue
      }
      esc = ch === '\\' && !esc ? true : false
      continue
    }
    if (!state.inBlockComment && ch === '/' && line[i + 1] === '*') {
      state.inBlockComment = true
      i++
      esc = false
      continue
    }
    if (!state.inBacktick && ch === '`') {
state.inBacktick = true
esc = false
continue
}
esc = false
}
return state
}

function processContentPreserveBlocks(content) {
const lines = content.split(/\r?\n/)
const out = []
let state = { inBlockComment: false, inBacktick: false }

for (let line of lines) {
if (!state.inBlockComment && !state.inBacktick) {
// Formatear imports: añadir espacios y ordenar alfabéticamente
line = line.replace(/import\s+{([^}]+)}/g, (_, inside) => {
const items = inside
.split(',')
.map(s => s.trim())
.filter(Boolean)
.sort((a, b) => a.localeCompare(b))
.join(', ')
return `import { ${items } }`
})
}

if (state.inBlockComment || state.inBacktick) {
out.push(line)
state = scanLineForStateTransitions(line, state)
continue
}

const stripped = line.replace(/^[\t ]+/, '')
out.push(stripped)
state = scanLineForStateTransitions(line, state)
}

return out.join('\n')
}

async function handleFile(filePath) {
if (!filePath.endsWith('.js')) return
try {
const st = await stat(filePath)
if (!st.isFile()) return
} catch {
return
}

const raw = await readFile(filePath, 'utf8')
const processed = processContentPreserveBlocks(raw)

if (processed === raw) {
console.log('unchanged', filePath)
return
}

console.log(dry ? '[dry] would modify' : 'modify', filePath)
if (!dry) {
await writeFile(filePath, processed, 'utf8')
console.log(' written', filePath)
modifiedFiles.push(filePath)
}
}

async function main() {
console.log('removeIndent starting on', dir)
if (dry) console.log('dry-run mode, no files will be overwritten')
await walk(dir, handleFile)

console.log('\n✅ Format Summary:')
console.log(`Total files modified: ${modifiedFiles.length}`)
if (modifiedFiles.length > 0) {
console.log('Files modified:')
modifiedFiles.forEach(f => console.log(' -', f))
} else {
console.log('No files were modified.')
}

console.log('done')
}

main().catch(err => {
console.error('error', err)
process.exit(1)
})

/*
===============================================
COMANDOS PARA EJECUTAR EN LA TERMINAL
===============================================

# Ejecute prettier primero para embellecer
npx prettier --write .

# Solo mostrar qué archivos se modificarían (modo dry-run)
node format.js --dry

# Ejecutar directamente en la carpeta actual
node format.js

# Ejecutar en una carpeta específica
node format.js ./lib

AzamiJs:
- format alinea imports, limpia sangrías y ordena imports alfabéticamente
- Mantiene los comentarios de bloque intactos
- Al final se imprime un resumen de los archivos modificados
- Todo es a petición de GataDios
*/