'use strict'

const { test } = require('ava')
const path = require('path')

const ffmpegProbe = require('.')

const fixturesPath = path.join(__dirname, `media`)

const fixtures = [
  {
    file: '0.mp4',
    width: 640,
    height: 360,
    duration: 4000,
    fps: 25
  },
  {
    file: '1.mp4',
    width: 640,
    height: 360,
    duration: 4000,
    fps: 25
  },
  {
    file: '2.mp4',
    width: 640,
    height: 360,
    duration: 4000,
    fps: 25
  }
]

fixtures.forEach((fixture) => {
  const input = path.join(fixturesPath, fixture.file)

  test(fixture.file, async (t) => {
    const probe = await ffmpegProbe(input)
    t.deepEqual(probe.width, fixture.width)
    t.deepEqual(probe.height, fixture.height)
    t.deepEqual(probe.duration, fixture.duration)
    t.deepEqual(probe.fps, fixture.fps)
  })
})
