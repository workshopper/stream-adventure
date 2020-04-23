const exercise = require('../../lib/stdinExercise')
const { inputFromAliens } = require('../../lib/utils')

exercise.inputStdin = inputFromAliens()

module.exports = exercise
