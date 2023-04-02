/**
 * author       : Sunil Wang
 * createTime   : 2017/7/10 10:36
 * description  :
 */
var bucket = require('./bucket')
var fs = require('fs')
var os = require('os')
var co = require('../util/co')
var exec = require('./exec')

var originalOperatingSystem = {
  checkLastResort: co.wrap(function * (){
    return exec('uname -sr')
  }),
  darwin: function () {
    var self = this

    return co(function * (){
      var res = yield exec('sw_vers')

      if(bucket.isNotSupported(res)) return self.checkLastResort()

      var version = res.match(/[\n\r].*ProductVersion:\s*([^\n\r]*)/)[1]
      var distribution = res.match(/.*ProductName:\s*([^\n\r]*)/)[1]

      return distribution + ' ' + version
    })
  },
  linux: function () {
    var self = this

    // Debian, Ubuntu, CentOS
    return new Promise(function (resolve) {
      fs.readFile('/etc/issue', function (err, out) {
        if (err) {
          return self.checkLastResort(resolve)
        }
        out = out.toString()
        var version = out.match(/[\d]+(\.[\d][\d]?)?/)

        if (version !== null) {
          version = version[0]
        }
        var distribution = out.match(/[\w]*/)[0]

        if (version !== null && distribution !== null) {
          var resultOs = distribution + ' ' + version
          return resolve(resultOs)
        } else if (distribution !== null && distribution !== '') {
          return resolve(distribution)
        } else if (version === null) {
          fs.readFile('/etc/redhat-release', function (err, out) {
            if (err) {
              return self.checkLastResort(resolve)
            }

            out = out.toString()
            version = out.match(/[\d]+(\.[\d][\d]?)?/)

            if (version !== null) {
              version = version[0]
            }

            var resultOs = 'Red Hat ' + version
            return resolve(resultOs)
          })
        }
      })
    })
  }
}

bucket.os = {
  oos: function () {
    var platform = os.platform()

    if (platform === 'linux') {
      return originalOperatingSystem.linux()
    }

    if (platform === 'darwin') {
      return originalOperatingSystem.darwin()
    }

    return originalOperatingSystem.checkLastResort()
  },
  platform: function () {
    return os.platform()
  },
  uptime: function () {
    // seconds
    return os.uptime()
  },
  ip: function () {
    var platform = os.platform()
    var interfaces = os.networkInterfaces()
    var ip = ''
    var i = 0
    try {

      if (platform === 'linux' && interfaces.eth0) {
        for (i = 0; i < interfaces.eth0.length; i++) {
          if (os.networkInterfaces().eth0[i].family === 'IPv4') {
            ip = os.networkInterfaces().eth0[i].address
            break
          }
        }

        return ip
      }

      if (platform === 'darwin') {
        for (i = 0; i < interfaces.en0.length; i++) {
          if (os.networkInterfaces().en0[i].family === 'IPv4') {
            ip = os.networkInterfaces().en0[i].address
            break
          }
        }

        return ip
      }

      for (i in interfaces) {
        var item = interfaces[i]
        for (var j in item) {
          if (item[j]['internal'] === false && item[j]['family'] === 'IPv4') {
            ip = item[j]['address']
            break
          }
        }
      }
    } catch (error){
      ip = 'LOCALHOST'
    }

    return ip
  },
  hostname: function () {
    return os.hostname()
  },
  type: function () {
    return os.type()
  },
  arch: function () {
    return os.arch()
  }
}
