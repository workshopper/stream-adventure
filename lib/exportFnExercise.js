const path = require('path')

let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')

const { readableStream } = require('./utils')
const stdinProcessor = require('./stdinProcessor')
const solutionSetup = require('./solutionSetup')

exercise = solutionSetup(exercise)

exercise = filecheck(exercise)

exercise.addSetup(function (mode, callback) {
  this.submissionFn = require(path.resolve(this.args[0]))

  if (typeof this.submissionFn !== 'function') {
    this.emit('fail', this.__('fail.invalid_export'))
  }
  this.solutionFn = require(this.solution)

  process.nextTick(callback)
})

exercise.addProcessor(function (mode, callback) {
  if (this.execArgs) {
    this.submissionChild = this.submissionFn(process.execPath, this.execArgs)
  } else {
    this.submissionChild = this.submissionFn(this.submissionArgs)
  }
  this.submissionStdout = this.submissionChild
  this.submissionChild.stdin = this.submissionChild

  // We need a readable stream for `submissionChild.stderr`, since is piped to
  // `process.stderr` later by comparestdout
  // https://github.com/workshopper/workshopper-exercise/blob/master/comparestdout.js#L37
  this.submissionChild.stderr = readableStream()

  if (mode === 'verify') {
    if (this.execArgs) {
      this.solutionChild = this.solutionFn(process.execPath, this.execArgs)
    } else {
      this.solutionChild = this.solutionFn(this.solutionArgs)
    }
    this.solutionStdout = this.solutionChild
    this.solutionChild.stdin = this.solutionChild
  }

  process.nextTick(function () {
    callback(null, true)
  })
})

exercise = stdinProcessor(exercise)

module.exports = exercise
