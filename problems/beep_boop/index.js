const path = require('path')
const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exercise')

exercise.solution = path.join(__dirname, 'solution.js')

exercise = comparestdout(exercise)

module.exports = exercise
