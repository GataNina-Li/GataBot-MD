/**
 * author       : Sunil Wang
 * createTime   : 2017/7/9 19:39
 * description  :
 */
var bucket = require('./bucket')
var os = require('os')

bucket.cpu = {
  average: function () {
    var totalIdle = 0
    var totalTick = 0
    var cpus = os.cpus()

    for (var i = 0, len = cpus.length; i < len; i++) {
      var cpu = cpus[i]
      for (var type in cpu.times) {
        totalTick += cpu.times[type]
      }
      totalIdle += cpu.times.idle
    }

    return {
      totalIdle: totalIdle,
      totalTick: totalTick,
      avgIdle: (totalIdle / cpus.length),
      avgTotal: (totalTick / cpus.length)
    }
  },
  usage: function (interval) {
    var self = this

    if (!interval) {
      interval = bucket.options.INTERVAL
    }

    return new Promise(function (resolve) {
      if (typeof interval !== 'number') {
        throw new TypeError('interval must be a number!')
      }

      var startMeasure = self.average()

      setTimeout(function () {
        var endMeasure = self.average()
        var idleDifference = endMeasure.avgIdle - startMeasure.avgIdle
        var totalDifference = endMeasure.avgTotal - startMeasure.avgTotal
        var cpuPercentage = (10000 - Math.round(10000 * idleDifference / totalDifference)) / 100

        return resolve(cpuPercentage)
      }, interval)
    })
  },
  free: function (interval) {
    var self = this

    if (!interval) {
      interval = bucket.options.INTERVAL
    }

    return new Promise(function (resolve) {
      if (typeof interval !== 'number') {
        throw new TypeError('interval must be a number!')
      }

      self.usage(interval)
        .then(function (cpuPercentage) {
          return resolve(100 - cpuPercentage)
        })
    })
  },
  count: function () {
    return os.cpus().length
  },
  model: function () {
    return os.cpus()[0].model
  },
  loadavg: function () {
    return os.loadavg()
  },
  loadavgTime: function (time) {
    time = parseInt(time, 10)

    var loads = os.loadavg()

    switch (time) {
      case 5:
        return loads[1]
      case 15:
        return loads[2]
      default: return loads[0]
    }
  }
}
