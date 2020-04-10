const path = require('path')

const exercise = require('../../lib/stdinExercise')
const { inputFromAliens } = require('../../lib/utils')

exercise.solution = path.join(__dirname, 'solution.js')
exercise.inputStdin = inputFromAliens()

module.exports = exercise
