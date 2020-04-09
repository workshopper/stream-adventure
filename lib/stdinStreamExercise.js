const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('./exercise')
const stdinStreamProcessor = require('./stdinStreamProcessor')

exercise = stdinStreamProcessor(exercise)

exercise = comparestdout(exercise)

module.exports = exercise
