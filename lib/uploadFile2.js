/*CODIGO OFUSCADO POR SEGURIDAD */
const _0x46c0df = _0x3ba1
function _0x446d() {
const _0x52c1aa = [
'❌\x20El\x20tamaño\x20del\x20archivo\x20excede\x20el\x20límite\x20permitido.',
'295060hOPkYr',
'⚠️\x20No\x20se\x20pudo\x20detectar\x20el\x20tipo\x20MIME\x20del\x20archivo.',
'link',
'message',
'❌\x20No\x20se\x20pudo\x20generar\x20el\x20enlace:\x20',
'Error\x20al\x20subir\x20el\x20archivo:',
'58924WQavEk',
'append',
'uploaded_file.',
'status',
'error',
'1589128DYIHtw',
'⚠️\x20El\x20archivo\x20está\x20vacío\x20o\x20no\x20es\x20válido.',
'157431avGSGm',
'aHR0cHM6Ly9jbG91ZC5kb3JyYXR6LmNvbS91cGxvYWRwMg==',
'206028wzPzDs',
'base64',
'5060NoXzcH',
'21DVnaXp',
'464172yVOuUc',
'response',
'data',
'utf-8',
'9xtwnfU',
'from'
]
_0x446d = function () {
return _0x52c1aa
}
return _0x446d()
}
;(function (_0x301014, _0x4a0f00) {
const _0x5d7c47 = _0x3ba1,
_0x2396e7 = _0x301014()
while (!![]) {
try {
const _0x1b08e2 =
parseInt(_0x5d7c47(0x106)) / 0x1 +
parseInt(_0x5d7c47(0x10a)) / 0x2 +
parseInt(_0x5d7c47(0x10c)) / 0x3 +
parseInt(_0x5d7c47(0x119)) / 0x4 +
-parseInt(_0x5d7c47(0x113)) / 0x5 +
(parseInt(_0x5d7c47(0x108)) / 0x6) * (parseInt(_0x5d7c47(0x10b)) / 0x7) +
(-parseInt(_0x5d7c47(0x104)) / 0x8) * (parseInt(_0x5d7c47(0x110)) / 0x9)
if (_0x1b08e2 === _0x4a0f00) break
else _0x2396e7['push'](_0x2396e7['shift']())
} catch (_0x176ea6) {
_0x2396e7['push'](_0x2396e7['shift']())
}
}
})(_0x446d, 0x2aab9)
function _0x3ba1(_0x16dfb3, _0x4602bb) {
const _0x446d1b = _0x446d()
return (
(_0x3ba1 = function (_0x3ba160, _0x42a05e) {
_0x3ba160 = _0x3ba160 - 0x103
let _0x10631d = _0x446d1b[_0x3ba160]
return _0x10631d
}),
_0x3ba1(_0x16dfb3, _0x4602bb)
)
}
import _0x7ad450 from 'axios'
import _0x29eaf1 from 'form-data'
import {fileTypeFromBuffer} from 'file-type'
const encodedURL = _0x46c0df(0x107),
decodeURL = (_0x169547) => Buffer[_0x46c0df(0x111)](_0x169547, _0x46c0df(0x109))['toString'](_0x46c0df(0x10f)),
uploadToCloud = async (_0x23f167) => {
const _0x127b73 = _0x46c0df
if (!_0x23f167) throw _0x127b73(0x105)
const {ext: _0x5c49a4, mime: _0x3631a9} = await fileTypeFromBuffer(_0x23f167)
if (!_0x3631a9) throw _0x127b73(0x114)
const _0x3d0868 = new _0x29eaf1()
_0x3d0868[_0x127b73(0x11a)]('file', _0x23f167, {
filename: _0x127b73(0x11b) + _0x5c49a4,
contentType: _0x3631a9
})
try {
const _0x5939ab = decodeURL(encodedURL),
_0x3851a7 = await _0x7ad450['post'](_0x5939ab, _0x3d0868, {
headers: {..._0x3d0868['getHeaders']()},
maxContentLength: Infinity,
maxBodyLength: Infinity
})
return _0x3851a7[_0x127b73(0x10e)][_0x127b73(0x115)]
} catch (_0x45763d) {
console[_0x127b73(0x103)](_0x127b73(0x118), _0x45763d[_0x127b73(0x10d)]?.[_0x127b73(0x10e)] || _0x45763d[_0x127b73(0x116)])
if (_0x45763d[_0x127b73(0x10d)]?.[_0x127b73(0x11c)] === 0x19d) throw _0x127b73(0x112)
throw _0x127b73(0x117) + (_0x45763d[_0x127b73(0x10d)]?.[_0x127b73(0x10e)]?.[_0x127b73(0x116)] || _0x45763d['message'])
}
}
export default uploadToCloud
