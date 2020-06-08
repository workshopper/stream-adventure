let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const execute = require('workshopper-exercise/execute')
const solutionSetup = require('./solutionSetup')

exercise = filecheck(exercise)

exercise = execute(exercise)

exercise = solutionSetup(exercise)

module.exports = exercise
