const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('./exercise')
const stdinProcessor = require('./stdinProcessor')

exercise = stdinProcessor(exercise)

exercise = comparestdout(exercise)

module.exports = exercise
