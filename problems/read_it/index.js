const exercise = require('../../lib/basicExercise')
const { inputFromAliens } = require('../../lib/utils')

exercise.addSetup(function (mode, callback) {
  const data = inputFromAliens().join('')

  this.submissionArgs.unshift(data)
  this.solutionArgs.unshift(data)

  process.nextTick(callback)
})

module.exports = exercise
