var fs = require('fs')
var path = require('path')
var verify = require('adventure-verify')
var crypto = require('crypto')
var spawn = require('child_process').spawn
var concat = require('concat-stream')
var words = require('./words.json')

exports.problem = fs.createReadStream(path.join(__dirname, 'problem.txt'))
exports.solution = fs.createReadStream(path.join(__dirname, 'solution.js'))

var file = path.join(__dirname, 'finnegans_wake.txt')

exports.verify = verify({ modeReset: true }, function (args, t) {
  t.plan(4)
  t.equal(args.length, 1, 'stream-adventure verify YOURFILE.js')

  var pw = words[Math.floor(Math.random() * words.length)]
  var key = crypto.createHash('md5').update(pw).digest('hex')
  var iv = crypto.randomBytes(8).toString('hex')
  var ps = spawn(process.execPath, [args[0], key, iv])
  ps.once('exit', function (code) {
    t.equal(code, 0, 'successful exit code')
  })
  ps.stderr.pipe(process.stderr)
  ps.stdout.pipe(concat(function (body) {
    fs.readFile(file, function (err, expected) {
      t.ifError(err)
      t.equal(body.toString(), expected.toString())
    })
  }))

  var enc = crypto.createCipheriv('aes256', key, iv)
  if (!enc.pipe) {
    t.fail('Your version of node is too old to play this level. ' +
            'Please upgrade to node >= 0.10.'
    )
  }

  fs.createReadStream(file).pipe(enc).pipe(ps.stdin)
})

exports.run = function (args) {
  var pw = words[Math.floor(Math.random() * words.length)]
  var key = crypto.createHash('md5').update(pw).digest('hex')
  var iv = crypto.randomBytes(8).toString('hex')
  var ps = spawn(process.execPath, [args[0], key, iv])
  ps.stderr.pipe(process.stderr)
  ps.stdout.pipe(process.stdout)
  var enc = crypto.createCipheriv('aes256', key, iv)
  fs.createReadStream(file).pipe(enc).pipe(ps.stdin)
}
