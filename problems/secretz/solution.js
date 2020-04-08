// Here's the reference solution:

var crypto = require('crypto')
var tar = require('tar')
var zlib = require('zlib')
var concat = require('concat-stream')

var parser = new tar.Parse()
parser.on('entry', function (e) {
  if (e.type !== 'File') return e.resume()

  var h = crypto.createHash('md5', { encoding: 'hex' })
  e.pipe(h).pipe(concat(function (hash) {
    console.log(hash + ' ' + e.path)
  }))
})

var cipher = process.argv[2]
var key = process.argv[3]
var iv = process.argv[4]
process.stdin
  .pipe(crypto.createDecipheriv(cipher, key, iv))
  .pipe(zlib.createGunzip())
  .pipe(parser)
