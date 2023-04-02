/**
 * author       : Sunil Wang
 * createTime   : 2017/7/9 22:16
 * description  :
 */
var bucket = require('./bucket')
var co = require('../util/co')
var exec = require('./exec')

var ifconfig = {
  breakIntoBlocks: function breakIntoBlocks (fullText) {
    var blocks = []
    var lines = fullText.split('\n')
    var currentBlock = []
    lines.forEach(function (line) {
      if (line.length > 0 && ['\t', ' '].indexOf(line[0]) === -1 && currentBlock.length > 0) {
        // start of a new block detected
        blocks.push(currentBlock)
        currentBlock = []
      }
      if (line.trim()) {
        currentBlock.push(line)
      }
    })
    if (currentBlock.length > 0) {
      blocks.push(currentBlock)
    }
    return blocks
  },

  parseSingleBlock: function parseSingleBlock (block) {
    var data = {}
    block.forEach(function (line, i) {
      var match = line.match(/^(\S+)\s+Link/)
      if (i === 0) {
        var match2 = line.match(/([a-zA-Z0-9]+):\s/)
        if (match === null && match2) {
          match = match2
        }
      }
      if (match) { // eth0      Link encap:Ethernet  HWaddr 04:01:d3:db:fd:01
        data.device = match[1] // eth0
        var link = {}
        match = line.match(/encap:(\S+)/)
        if (match) {
          link.encap = match[1]
        }
        match = line.match(/HWaddr\s+(\S+)/)
        if (match) {
          link.hwaddr = match[1]
        }
        data.link = link
      } else {
        var section = data.other || {}
        if ((match = line.match(/collisions:(\S+)/))) {
          section.collisions = parseInt(match[1])
        }
        if ((match = line.match(/txqueuelen:(\S+)/))) {
          section.txqueuelen = parseInt(match[1])
        }
        if ((match = line.match(/RX bytes:(\S+)/))) {
          section.rxBytes = parseInt(match[1])
        }
        if ((match = line.match(/RX packets (\S+) {2}bytes (\S+)/))) {
          section.rxBytes = parseInt(match[2])
        }
        if ((match = line.match(/TX bytes:(\S+)/))) {
          section.txBytes = parseInt(match[1])
        }
        if ((match = line.match(/TX packets (\S+) {2}bytes (\S+)/))) {
          section.txBytes = parseInt(match[2])
        }
        data.other = section
      }
    })
    return data
  }
}

function ifconfigStats () {
  return co(function * () {
    var res = yield exec('ifconfig')

    if(bucket.isNotSupported(res)) return res

    var blocks = ifconfig.breakIntoBlocks(res)
    var stats = []

    blocks.forEach(function (block, index) {
      blocks[index] = ifconfig.parseSingleBlock(block)
      stats[index] = {
        'interface': blocks[index].device,
        'inputBytes': (blocks[index].other && blocks[index].other.rxBytes) || 0,
        'outputBytes': (blocks[index].other && blocks[index].other.txBytes) || 0
      }
    })

    return stats
  })
}

bucket.netstat = {
  stats: co.wrap(function * () {
    var out = yield exec('ip -s link')

    if(bucket.isNotSupported(out)) return ifconfigStats()

    var names = new RegExp(/[0-9]+: ([\S]+): /g)
    var RX = new RegExp(/^\s+RX:\s+bytes\s+packets\s+errors\s+dropped\s+(overrun|missed)\s+mcast\s*\n\s*([0-9]+)\s+/gm)
    var TX = new RegExp(/^\s+TX:\s+bytes\s+packets\s+errors\s+dropped\s+carrier\s+collsns\s*\n\s*([0-9]+)\s+/gm)

    var stats = []
    var i = 0
    var res = []

    while ((res = names.exec(out)) !== null) {
      stats[i++] = {
        interface: res[1]
      }
    }

    i = 0
    while ((res = RX.exec(out)) !== null) {
      stats[i++].inputBytes = res[2]
    }

    i = 0
    while ((res = TX.exec(out)) !== null) {
      stats[i++].outputBytes = res[1]
    }

    return stats
  }),
  inOut: function (interval) {
    var self = this

    if (!interval) {
      interval = bucket.options.INTERVAL
    }

    return Promise.all([
      self.stats(),
      (function () {
        return new Promise(function (resolve) {
          setTimeout(function () {
            self.stats().then(resolve)
          }, interval)
        })
      })()
    ]).then(function (stats) {
      var oldStats = stats[0]
      var newStats = stats[1]

      var metrics = {
        total: {
          inputMb: 0,
          outputMb: 0
        }
      }
      var nbProblems = 0

      for (var i = 0; i < oldStats.length; i++) {
        if (oldStats[i].interface !== 'lo' && oldStats[i].interface !== 'lo0' && oldStats[i].inputBytes > 0 && oldStats[i].outputBytes > 0) {
          metrics[oldStats[i].interface] = {}
          metrics[oldStats[i].interface]['inputMb'] = parseFloat(((newStats[i].inputBytes - oldStats[i].inputBytes) / 1000000).toFixed(2))
          metrics[oldStats[i].interface]['outputMb'] = parseFloat(((newStats[i].outputBytes - oldStats[i].outputBytes) / 1000000).toFixed(2))

          metrics.total['inputMb'] += parseFloat(metrics[oldStats[i].interface]['inputMb'])
          metrics.total['outputMb'] += parseFloat(metrics[oldStats[i].interface]['outputMb'])
        } else {
          nbProblems++
        }
      }

      if (nbProblems === oldStats.length) {
        return Promise.resolve(bucket.options.NOT_SUPPORTED_VALUE)
      }

      return Promise.resolve(metrics)
    })
  }
}
