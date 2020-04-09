const path = require('path')

const exercise = require('../../lib/stdinStreamExercise')

exercise.solution = path.join(__dirname, 'solution.js')
exercise.inputFilePath = path.join(__dirname, '/input.html')

module.exports = exercise
