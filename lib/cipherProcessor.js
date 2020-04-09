const fs = require('fs')
const crypto = require('crypto')

function cipherProcessor (exercise) {
  exercise.addSetup(function (mode, callback) {
    const { algorithm, key, iv } = this.cipherArgs

    this.submissionArgs = this.submissionArgs.concat(this.execArgs)
    this.solutionArgs = this.solutionArgs.concat(this.execArgs)

    this.submissionCipher = crypto.createCipheriv(algorithm, key, iv)
    this.solutionCipher = crypto.createCipheriv(algorithm, key, iv)

    process.nextTick(callback)
  })

  exercise.addProcessor(function (mode, callback) {
    fs.createReadStream(this.inputFilePath).pipe(this.submissionCipher).pipe(this.submissionChild.stdin)

    if (mode === 'verify') {
      fs.createReadStream(this.inputFilePath).pipe(this.solutionCipher).pipe(this.solutionChild.stdin)
    }

    process.nextTick(callback)
  })

  return exercise
}

module.exports = cipherProcessor
