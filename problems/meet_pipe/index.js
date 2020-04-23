const fs = require('fs')
const path = require('path')
const os = require('os')

const exercise = require('../../lib/basicExercise')
const { inputFromAliens } = require('../../lib/utils')
const testFile = path.resolve(os.tmpdir(), 'meet-pipe-data.txt')

exercise.addSetup(function (mode, callback) {
  const data = inputFromAliens().join('')

  this.submissionArgs.unshift(testFile)
  this.solutionArgs.unshift(testFile)

  fs.writeFile(testFile, data, callback)
})

exercise.addCleanup(function (mode, passed, callback) {
  fs.unlink(testFile, callback)
})

module.exports = exercise
