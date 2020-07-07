function messageStdin (submissionStdin, solutionStdin, input, separator) {
  const iv = setInterval(function () {
    if (input.length) {
      const msg = separator ? input.shift() + separator : input.shift()
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

    messageStdin(
      this.submissionChild.stdin,
      solutionStdin,
      this.inputStdin,
      this.stdinMessageSeparator
    )

    process.nextTick(function () {
      callback(null, true)
    })
  })

  return exercise
}

module.exports = stdinProcessor
