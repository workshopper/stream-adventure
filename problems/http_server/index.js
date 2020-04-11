const path = require('path')
const through2 = require('through2')
const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exercise')

exercise.solution = path.join(__dirname, 'solution.js')

const hyperquest = require('hyperquest')
const words = require('./words.json')
const input = []
const offset = Math.floor(words.length * Math.random())
for (let i = 0; i < 10; i++) {
  const word = words[(offset + i) % words.length]
  input.push(`${word}\n`)
}

exercise.addSetup(function (mode, callback) {
  this.submissionPort = Math.floor(Math.random() * 40000 + 10000)
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
  let count = 0
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

  const iv = setInterval(function () {
    hq.write(input[count].trim() + '\n')

    if (++count === input.length) {
      clearInterval(iv)
      hq.end()
    }
  }, 50)
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
