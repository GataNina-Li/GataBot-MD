/**
 * author       : Sunil Wang
 * createTime   : 2017/7/10 14:31
 * description  :
 */
var bucket = require('./bucket')
var exec = require('./exec')
var os = require('os')
var co = require('../util/co')

bucket.proc = {
  totalProcesses: co.wrap(function * () {
    var res = yield exec("top -bn1 | awk 'NR > 7 && $8 ~ /R|S|D|T/ { print $12 }'")

    if(bucket.isNotSupported(res)){
      if (os.platform() === 'darwin') {
        var nb = yield exec('ps -A')

        nb = nb.toString().split('\n')

        return nb.length - 1
      }

      return res
    }

    var resultProc = (res.split('\n')).length

    return resultProc
  }),
  zombieProcesses: co.wrap(function * () {
    var res = yield exec("top -bn1 | awk 'NR > 7 && $8 ~ /Z/ { print $12 }'")

    if(bucket.isNotSupported(res)) return res

    return (res.split('\n')).length
  })
}
