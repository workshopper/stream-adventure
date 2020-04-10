
function messageStdin (submissionStdin, solutionStdin, input) {
  const iv = setInterval(function () {
    if (input.length) {
      const msg = input.shift()
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

    messageStdin(this.submissionChild.stdin, solutionStdin, this.inputStdin)

    process.nextTick(function () {
      callback(null, true)
    })
  })

  return exercise
}

module.exports = stdinProcessor
