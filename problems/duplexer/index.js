const path = require('path')

const exercise = require('../../lib/duplexExercise')

const words = [
  'beetle',
  'biscuit',
  'bat',
  'bobbin',
  'bequeath',
  'brûlée',
  'byzantine',
  'bazaar',
  'blip',
  'byte',
  'beep',
  'boop',
  'bust',
  'bite',
  'balloon',
  'box',
  'beet',
  'boolean',
  'bake',
  'bottle',
  'bug',
  'burrow'
]

const getInput = () => {
  const input = []
  const len = 10 + Math.floor(Math.random() * 5)
  for (let i = 0; i < len; i++) {
    const word = words[Math.floor(Math.random() * words.length)]
    input.push(`${word}\n`)
  }
  return input
}

exercise.inputStdin = getInput()

const n = 1 + Math.floor(Math.random() * 25)
const cmd = path.resolve(__dirname, 'command.js')
exercise.execArgs = [cmd, n]

module.exports = exercise
