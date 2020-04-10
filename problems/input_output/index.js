const path = require('path')
const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exercise')
const stdinProcessor = require('../../lib/stdinProcessor')

exercise.solution = path.join(__dirname, 'solution.js')

exercise = stdinProcessor(exercise)

exercise = comparestdout(exercise)

module.exports = exercise
