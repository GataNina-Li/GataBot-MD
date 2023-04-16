'use strict'

const { test } = require('ava')
const path = require('path')
const rmfr = require('rmfr')
const sharp = require('sharp')
const tempy = require('tempy')

const extractFrames = require('.')

const fixturesPath = path.join(__dirname, `media`)
const input = path.join(fixturesPath, '1.mp4')

test('default (all frames) => jpg', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%d.jpg'
  const output = path.join(folder, filename)

  await extractFrames({
    log: console.log,
    input,
    output
  })

  for (let i = 1; i <= 100; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'jpeg')
  }

  await rmfr(folder)
})

test('offsets => jpg', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%i.jpg'
  const output = path.join(folder, filename)

  await extractFrames({
    log: console.log,
    input,
    output,
    offsets: [
      0,
      1200,
      3200
    ]
  })

  for (let i = 1; i <= 3; ++i) {
    const file = output.replace('%i', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'jpeg')
  }

  await rmfr(folder)
})

test('timestamps => png', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%i.png'
  const output = path.join(folder, filename)

  await extractFrames({
    log: console.log,
    input,
    output,
    timestamps: [
      '0%',
      '25%',
      '60%',
      '95%'
    ]
  })

  for (let i = 1; i <= 4; ++i) {
    const file = output.replace('%i', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'png')
  }

  await rmfr(folder)
})

test('fps => png', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%d.png'
  const output = path.join(folder, filename)

  await extractFrames({
    log: console.log,
    input,
    output,
    fps: 2
  })

  for (let i = 1; i <= 10; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'png')
  }

  await rmfr(folder)
})

test('numFrames => jpg', async (t) => {
  const folder = tempy.directory()
  const filename = 'test-%d.jpg'
  const output = path.join(folder, filename)

  await extractFrames({
    log: console.log,
    input,
    output,
    numFrames: 7
  })

  for (let i = 1; i <= 7; ++i) {
    const file = output.replace('%d', i)
    const image = await sharp(file).metadata()

    t.deepEqual(image.width, 640)
    t.deepEqual(image.height, 360)
    t.deepEqual(image.channels, 3)
    t.deepEqual(image.format, 'jpeg')
  }

  await rmfr(folder)
})
