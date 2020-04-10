const fs = require('fs')
const path = require('path')

const exercise = require('../../lib/stdinExercise')
const data = fs.readFileSync(path.join(__dirname, 'finnegans_wake.txt'), 'utf8')
const input = data.split('\n')

exercise.solution = path.join(__dirname, 'solution.js')
exercise.inputStdin = input

module.exports = exercise
