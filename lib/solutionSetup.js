const path = require('path')

const solutionSetup = (exercise) => {
  exercise.addSetup(function (mode, callback) {
    this.solution = path.join(this.dir, 'solution.js')

    process.nextTick(callback)
  })

  exercise.getSolutionFiles = function (callback) {
    callback(null, [this.solution])
  }

  return exercise
}

module.exports = solutionSetup
