const fs = require('fs')
const path = require('path')

const exercise = require('../../lib/stdinExercise')
const data = fs.readFileSync(path.join(__dirname, '../../lib/finnegans_wake.txt'), 'utf8')
const input = data.split('\n')

exercise.inputStdin = input

module.exports = exercise
