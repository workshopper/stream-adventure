function messageStdin (submissionStdin, solutionStdin, input, separator) {
  const iv = setInterval(function () {
    if (input.length) {
      const msg = input.shift() + separator
      submissionStdin.write(msg)
      if (solutionStdin) solutionStdin.write(msg)
    } else {
      clearInterval(iv)
      submissionStdin.end()
      if (solutionStdin) solutionStdin.end()
    }
  }, 50)
}

function stdinProcessor (exercise) {
  exercise.addProcessor(function (mode, callback) {
    const solutionStdin = (mode === 'verify') ? this.solutionChild.stdin : null
    const separator = this.stdinMessageSeparator || ''

    messageStdin(this.submissionChild.stdin, solutionStdin, this.inputStdin, separator)

    process.nextTick(function () {
      callback(null, true)
    })
  })

  return exercise
}

module.exports = stdinProcessor
