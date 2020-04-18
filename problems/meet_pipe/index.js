const fs = require('fs')
const path = require('path')
const os = require('os')

const exercise = require('workshopper-exercise/basic')
const aliens = require('./aliens.json')
const testFile = path.resolve(os.tmpdir(), 'meet-pipe-data.txt')

exercise.solution = path.join(__dirname, 'solution.js')

exercise.addSetup(function (mode, callback) {
  const lines = []
  for (let i = 0; i < 10; i++) {
    lines.push(aliens[Math.floor(Math.random() * aliens.length)])
  }
  const data = lines.join('\n') + '\n'

  this.submissionArgs.unshift(testFile)
  this.solutionArgs.unshift(testFile)

  fs.writeFile(testFile, data, callback)
})

exercise.addCleanup(function (mode, passed, callback) {
  fs.unlink(testFile, callback)
})

module.exports = exercise
