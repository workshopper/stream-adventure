let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const execute = require('workshopper-exercise/execute')
const solutionSetup = require('./solutionSetup')

exercise = solutionSetup(exercise)

exercise = filecheck(exercise)

exercise = execute(exercise)

module.exports = exercise
