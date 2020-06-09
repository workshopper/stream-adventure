const crypto = require('crypto')
const tar = require('tar')
const zlib = require('zlib')
const concat = require('concat-stream')

const parser = new tar.Parse()
parser.on('entry', function (e) {
  if (e.type !== 'File') return e.resume()

  const h = crypto.createHash('md5', { encoding: 'hex' })
  e.pipe(h).pipe(concat(function (hash) {
    console.log(hash + ' ' + e.path)
  }))
})

const cipher = process.argv[2]
const key = process.argv[3]
const iv = process.argv[4]
process.stdin
  .pipe(crypto.createDecipheriv(cipher, key, iv))
  .pipe(zlib.createGunzip())
  .pipe(parser)
