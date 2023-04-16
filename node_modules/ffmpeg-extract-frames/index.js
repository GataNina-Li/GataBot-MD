'use strict'

const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const probe = require('ffmpeg-probe')

const noop = () => { }

module.exports = async (opts) => {
  const {
    log = noop,

    // required
    input,
    output,

    // optional
    timestamps,
    offsets,
    fps,
    numFrames,
    ffmpegPath
  } = opts

  if (!input) throw new Error('missing required input')
  if (!output) throw new Error('missing required output')

  const outputPath = path.parse(output)

  if (ffmpegPath) {
    ffmpeg.setFfmpegPath(ffmpegPath)
  }
  
  const cmd = ffmpeg(input)
    .on('start', (cmd) => log({ cmd }))

  if (timestamps || offsets) {
    const folder = outputPath.dir
    const filename = outputPath.base

    return new Promise((resolve, reject) => {
      cmd
        .on('end', () => resolve(output))
        .on('error', (err) => reject(err))
        .screenshots({
          folder,
          filename,
          timestamps: timestamps || offsets.map((offset) => offset / 1000)
        })
    })
  } else {
    if (fps) {
      cmd.outputOptions([
        '-r', Math.max(1, fps | 0)
      ])
    } else if (numFrames) {
      const info = await probe(input)
      const numFramesTotal = parseInt(info.streams[0].nb_frames)
      const nthFrame = (numFramesTotal / numFrames) | 0

      cmd.outputOptions([
        '-vsync', 'vfr',
        '-vf', `select=not(mod(n\\,${nthFrame}))`
      ])
    }

    if (outputPath.ext === '.raw') {
      cmd.outputOptions([
        '-pix_fmt', 'rgba'
      ])
    }

    return new Promise((resolve, reject) => {
      cmd
        .on('end', () => resolve(output))
        .on('error', (err) => reject(err))
        .output(output)
        .run()
    })
  }
}
