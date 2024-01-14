import express from 'express' 
import {createServer} from 'http'
import path from 'path'
import {Socket} from 'socket.io'
import {toBuffer} from 'qrcode'
import fetch from 'node-fetch'

function connect(conn, PORT) {
  const app = global.app = express()
  //console.log(app)
  const server = global.server = createServer(app)
  let _qr = 'QR invalido, probablemente ya hayas escaneado el QR.'

  conn.ev.on('connection.update', function appQR({qr}) {
    if (qr) {
      _qr = qr
      if (global.keepAliveRender === 1 && process.env.RENDER_EXTERNAL_URL) {
        console.log(`Para obtener el código QR ingresa a ${process.env.RENDER_EXTERNAL_URL}/get-qr-code`);
      }
    } 
  })
  
  app.get('/get-qr-code', async (req, res) => {
    res.setHeader('content-type', 'image/png')
    res.end(await toBuffer(_qr))
  });

  app.get('*', async (req, res) => {
    res.json("GATABOT-MD en ejecución");
  });

  server.listen(PORT, async () => {
    console.log('App listened on port', PORT)
    if (global.keepAliveRender === 1) await keepAliveHostRender();
    if (opts['keepalive']) keepAlive()
  })
}

function pipeEmit(event, event2, prefix = '') {
  const old = event.emit;
  event.emit = function(event, ...args) {
    old.emit(event, ...args)
    event2.emit(prefix + event, ...args)
  }
  return {
    unpipeEmit() {
      event.emit = old
    }}
}

function keepAlive() {
  const url = `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
  if (/(\/\/|\.)undefined\./.test(url)) return
  setInterval(() => {
    fetch(url).catch(console.error)
  }, 5 * 1000 * 60)
}


//Kurt18: Esta función va impedir que Render vaya a modo suspensión por inactividad
const keepAliveHostRender = async () => {
  try {
      setInterval(async() => {
        if (process.env.RENDER_EXTERNAL_URL) {
          const urlRender = process.env.RENDER_EXTERNAL_URL;
          const res = await fetch(urlRender);
          if (res.status === 200) {
            const result = await res.text();
            console.log(`Resultado desde keepAliveHostRender() ->`, result);
          }
        } else {
          console.log(`No se encontró URL en Host Render.com. Por favor ir a config.js y modificar a cero el valor de: global.keepAliveRender`);
        }
      }, 5 * 1000 * 60)
  } catch (error) {
    console.log(`Error manejado en server.js keepAliveHostRender() detalles: ${error}`);
  }
}

export default connect
