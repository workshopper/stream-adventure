const path = require('path')
const stream = require('stream')

let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const stdinProcessor = require('../../lib/stdinProcessor')
const comparestdout = require('workshopper-exercise/comparestdout')

const words = [
  'beetle',
  'biscuit',
  'bat',
  'bobbin',
  'bequeath',
  'brûlée',
  'byzantine',
  'bazaar',
  'blip',
  'byte',
  'beep',
  'boop',
  'bust',
  'bite',
  'balloon',
  'box',
  'beet',
  'boolean',
  'bake',
  'bottle',
  'bug',
  'burrow'
]

const getInput = () => {
  const input = []
  const len = 10 + Math.floor(Math.random() * 5)
  for (let i = 0; i < len; i++) {
    const word = words[Math.floor(Math.random() * words.length)]
    input.push(`${word}\n`)
  }
  return input
}

exercise = filecheck(exercise)

exercise.solution = path.join(__dirname, 'solution.js')
exercise.inputStdin = getInput()

exercise.addSetup(function (mode, callback) {
  this.submissionFn = require(path.resolve(this.args[0]))

  if (typeof this.submissionFn !== 'function') {
    this.emit('fail', this.__('fail.invalid_export'))
  }
  this.solutionFn = require(this.solution)

  process.nextTick(callback)
})

exercise.addProcessor(function (mode, callback) {
  const n = 1 + Math.floor(Math.random() * 25)
  const cmd = path.resolve(__dirname, 'command.js')

  this.submissionChild = this.submissionFn(process.execPath, [cmd, n])
  this.submissionStdout = this.submissionChild
  this.submissionChild.stdin = this.submissionChild

  // We need a readable stream for `submissionChild.stderr`, since is piped to
  // `process.stderr` later by comparestdout
  // https://github.com/workshopper/workshopper-exercise/blob/master/comparestdout.js#L37
  const stderr = new stream.Readable({ objectMode: true })
  stderr._read = function _read (n) { }

  this.submissionChild.stderr = stderr

  if (mode === 'verify') {
    this.solutionChild = this.solutionFn(process.execPath, [cmd, n])
    this.solutionStdout = this.solutionChild
    this.solutionChild.stdin = this.solutionChild
  }

  process.nextTick(function () {
    callback(null, true)
  })
})

exercise = stdinProcessor(exercise)

exercise = comparestdout(exercise)

module.exports = exercise
