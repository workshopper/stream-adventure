const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('./exercise')
const cipherProcessor = require('./cipherProcessor')

exercise = cipherProcessor(exercise)
exercise = comparestdout(exercise)

module.exports = exercise
