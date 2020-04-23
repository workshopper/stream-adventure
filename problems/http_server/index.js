const through2 = require('through2')
const hyperquest = require('hyperquest')
const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exercise')
const { inputFromWords, rndPort, writeStream } = require('../../lib/utils')

const input = inputFromWords()

exercise.addSetup(function (mode, callback) {
  this.submissionPort = rndPort()
  this.solutionPort = this.submissionPort + 1

  this.submissionArgs.push(this.submissionPort)
  this.solutionArgs.push(this.solutionPort)

  process.nextTick(callback)
})

exercise.addProcessor(function (mode, callback) {
  this.submissionStdout.pipe(process.stdout)

  this.submissionStdout = through2()
  if (mode === 'verify') {
    this.solutionStdout = through2()
  }

  setTimeout(query.bind(this, mode), 500)

  process.nextTick(function () {
    callback(null, true)
  })
})

function request (port, stream, exercise) {
  const url = `http://localhost:${port}`
  const hq = hyperquest.post(url)
    .on('error', function (err) {
      exercise.emit(
        'fail'
        , exercise.__('fail.connection', { address: url, message: err.message })
      )
    })
  hq.pipe(stream)

  setTimeout(function () {
    stream.unpipe(hq)
    stream.end()
  }, 5000)

  writeStream(hq, input, 50)
}

function query (mode) {
  const exercise = this

  request(this.submissionPort, this.submissionStdout, exercise)

  if (mode === 'verify') {
    request(this.solutionPort, this.solutionStdout, exercise)
  }
}

exercise = comparestdout(exercise)

module.exports = exercise
