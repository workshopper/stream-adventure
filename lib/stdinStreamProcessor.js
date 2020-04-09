const fs = require('fs')

function stdinStreamProcessor (exercise) {
  exercise.addProcessor(function (mode, callback) {
    fs.createReadStream(this.inputFilePath).pipe(this.submissionChild.stdin)
    if (mode === 'verify') {
      fs.createReadStream(this.inputFilePath).pipe(this.solutionChild.stdin)
    }

    process.nextTick(function () {
      callback(null, true)
    })
  })

  return exercise
}

module.exports = stdinStreamProcessor
