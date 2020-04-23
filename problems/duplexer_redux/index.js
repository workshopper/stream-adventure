const provinces = require('provinces')
const exercise = require('../../lib/duplexExercise')
const { readableStream } = require('../../lib/utils')

const getInput = () => {
  const input = []
  const len = 50 + Math.floor(Math.random() * 25)
  for (let i = 0; i < len; i++) {
    const p = provinces[Math.floor(Math.random() * provinces.length)]
    input.push(p)
  }
  return input
}

exercise.inputStdin = getInput()

const getCounter = () => {
  const counter = readableStream()
  counter.setCounts = function (counts) {
    const self = this
    Object.keys(counts).sort().forEach(function (key) {
      self.push(`${key} => ${counts[key]}\n`)
    })
    this.push(null)
  }
  return counter
}

exercise.submissionArgs = getCounter()
exercise.solutionArgs = getCounter()

module.exports = exercise
