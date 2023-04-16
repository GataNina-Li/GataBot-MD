/**
 * author       : Sunil Wang
 * createTime   : 2017/7/10 10:17
 * description  :
 */
var bucket = require('./bucket')
var exec = require('./exec')
var co = require('../util/co')

bucket.users = {
  openedCount: co.wrap(function * () {
    var res = yield exec('who | grep -v localhost | wc -l')

    if(bucket.isNotSupported(res)) return res

    return parseInt(res, 10)
  })
}
