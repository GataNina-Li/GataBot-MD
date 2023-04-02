/**
 * author       : Sunil Wang
 * createTime   : 2017/7/9 19:08
 * description  :
 */
var bucket = require('./bucket')
var exec = require('./exec')
var wrapExec = exec.wrapExec

bucket.osCmd = {
  topCpu: wrapExec('ps -eo pcpu,user,args --no-headers | sort -k 1 -n | tail -n 10 | sort -k 1 -nr | cut -c 1-70'),
  topMem: wrapExec('ps -eo pmem,pid,cmd | sort -k 1 -n | tail -n 10 | sort -k 1 -nr | cut -c 1-70'),
  vmstats: wrapExec('vmstat -S m'),
  processesUsers: wrapExec('ps hax -o user | sort | uniq -c'),
  diskUsage: wrapExec('df -h'),
  who: wrapExec('who'),
  whoami: wrapExec('whoami'),
  openPorts: wrapExec('lsof -Pni4 | grep ESTABLISHED'),
  ifconfig: wrapExec('ifconfig')
}
