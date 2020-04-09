const fs = require('fs')
const path = require('path')
const os = require('os')

let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const execute = require('workshopper-exercise/execute')
const comparestdout = require('workshopper-exercise/comparestdout')
const aliens = require('./aliens.json')
const testFile = path.resolve(os.tmpdir(), 'meet-pipe-data.txt')

exercise = filecheck(exercise)

exercise = execute(exercise)

exercise = comparestdout(exercise)

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
