const path = require('path')

const exercise = require('../../lib/stdinStreamExercise')

exercise.inputFilePath = path.join(__dirname, '/input.html')

module.exports = exercise
