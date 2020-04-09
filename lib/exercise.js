let exercise = require('workshopper-exercise')()
const filecheck = require('workshopper-exercise/filecheck')
const execute = require('workshopper-exercise/execute')

exercise = filecheck(exercise)

exercise = execute(exercise)

module.exports = exercise
