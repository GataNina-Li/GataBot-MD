/**
 * @Author: 王澍（SunilWang）
 * @Date: 2017-7-9 21:49:00
 * @Last Modified by: 王澍（SunilWang）
 * @Last Modified time: 2020-09-10 14:59:41
 * @Description:
 */
var bucket = require('./bucket')
var os = require('os')
var fs = require('fs')
var co = require('../util/co')
var util = require('../util')
var exec = require('./exec')

var linuxFreeMemory = function () {
  return new Promise(function (resolve) {
    // https://github.com/SunilWang/node-os-utils/pull/11
    // running this on an embedded linux device. This steps takes around 500ms. With this change we brought it down to a few milliseconds.
    fs.readFile('/proc/meminfo', 'utf8', function (err, out) {
      if (err) {
        return resolve(bucket.options.NOT_SUPPORTED_VALUE)
      }
      var memInfo = {}
      var usage = out.toString().trim().split('\n')
      usage.forEach((line) => {
        var pair = line.split(':')
        memInfo[pair[0]] = parseInt(pair[1], 10)
      })

      var totalMem = parseInt(memInfo.MemTotal, 10) * 1024

      // check if MemAvailable exists
      if (!memInfo.MemAvailable) {
        memInfo.MemAvailable = memInfo['MemFree'] + memInfo['Buffers'] + memInfo['Cached'] + memInfo['SReclaimable'] - memInfo['Shmem'];
      }
      var freeMem = memInfo.MemAvailable * 1024

      // https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=34e431b0ae398fc54ea69ff85ec700722c9da773
      // https://www.cnblogs.com/johnnyzen/p/8011309.html
      if (os.release() < '3.14') {
        freeMem =
          ((memInfo.MemFree || 0) +
            (memInfo.Buffers || 0) +
            (memInfo.Cached || 0)) *
          1024
      }

      return resolve({ totalMem, freeMem })
    })
  })
}

// learn from: https://github.com/X-Profiler/xtransit/blob/master/orders/system_log.js#L356
var osxFreeMemory = co.wrap(function* () {
  var totalMem = os.totalmem()
  var mappings = {
    'Pages purgeable': 'purgeable',
    'Pages wired down': 'wired',
    'Pages active': 'active',
    'Pages inactive': 'inactive',
    'Pages occupied by compressor': 'compressed',
  }
  var [vmStat, pagePageable] = yield Promise.all([
    exec('vm_stat'),
    exec('sysctl vm.page_pageable_internal_count'),
  ])

  vmStat = vmStat.toString().trim()
  pagePageable = pagePageable.toString().trim()

  // get page size
  var pageSize = 4096
  var matchdPageSize = /page size of (\d+) bytes/.exec(vmStat)

  if (matchdPageSize && util.isNumber(matchdPageSize[1])) {
    pageSize = Number(matchdPageSize[1])
  }

  // get page pageable
  var [, pageableValue] = pagePageable.split(':')

  if (!util.isNumber(pageableValue)) {
    return {
      totalMem,
      freeMem: os.freemem(),
    }
  }

  pageableValue = Number(pageableValue) * pageSize

  // get vm stats
  var lines = vmStat.split('\n').filter((x) => x !== '')
  var stats = {}

  lines.forEach((x) => {
    var parts = x.split(':')
    var key = parts[0]
    var val = parts[1].replace('.', '').trim()

    if (mappings[key]) {
      var ky = mappings[key]
      stats[ky] = val * pageSize
    }
  })

  // get app memory
  var appMemory = pageableValue - stats.purgeable
  // get wired memory
  var wiredMemory = stats.wired
  // get compressed memory
  var compressedMemory = stats.compressed
  var used = appMemory + wiredMemory + compressedMemory

  return {
    totalMem,
    freeMem: totalMem - used,
  }
})

bucket.mem = {
  info: co.wrap(function* () {
    var totalMem = null
    var freeMem = null
    var memInfo = yield linuxFreeMemory()

    if (bucket.isNotSupported(memInfo)) {
      totalMem = os.totalmem()
      freeMem = os.freemem()
      if (os.platform() === 'darwin') {
        var mem = yield osxFreeMemory()
        totalMem = mem.totalMem
        freeMem = mem.freeMem
      }
    } else {
      totalMem = memInfo.totalMem
      freeMem = memInfo.freeMem
    }

    var totalMemMb = parseFloat((totalMem / 1024 / 1024).toFixed(2))
    var usedMemMb = parseFloat(((totalMem - freeMem) / 1024 / 1024).toFixed(2))
    var freeMemMb = parseFloat((totalMemMb - usedMemMb).toFixed(2))
    var usedMemPercentage = parseFloat((100 * ((totalMem - freeMem) / totalMem)).toFixed(2))
    var freeMemPercentage = parseFloat((100 * (freeMem / totalMem)).toFixed(2))

    return {
      totalMemMb: totalMemMb,
      usedMemMb: usedMemMb,
      freeMemMb: freeMemMb,
      usedMemPercentage: usedMemPercentage,
      freeMemPercentage: freeMemPercentage,
    }
  }),
  free: function () {
    var self = this

    return self.info().then(function (res) {
      return Promise.resolve({
        totalMemMb: res.totalMemMb,
        freeMemMb: res.freeMemMb,
      })
    })
  },
  used: function () {
    var self = this

    return self.info().then(function (res) {
      return Promise.resolve({
        totalMemMb: res.totalMemMb,
        usedMemMb: res.usedMemMb,
      })
    })
  },
  totalMem: function () {
    return os.totalmem()
  },
}
