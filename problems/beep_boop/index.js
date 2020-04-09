const path = require('path')

let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const execute = require('workshopper-exercise/execute')
const comparestdout = require('workshopper-exercise/comparestdout')
const wrappedexec = require('workshopper-wrappedexec')

exercise = filecheck(exercise)

exercise = execute(exercise)

exercise.solution = path.join(__dirname, 'solution.js')

exercise = comparestdout(exercise)

exercise = wrappedexec(exercise)

module.exports = exercise
