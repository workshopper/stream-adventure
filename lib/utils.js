const { Readable } = require('stream')

const aliens = require('./aliens.json')
const words = require('./words.json')

const inputFromAliens = () => {
  const input = []
  for (let i = 0; i < 10; i++) {
    const alien = aliens[Math.floor(Math.random() * aliens.length)]
    input.push(`${alien}\n`)
  }
  return input
}

const inputFromWords = () => {
  const input = []
  const offset = Math.floor(words.length * Math.random())
  for (let i = 0; i < 10; i++) {
    const word = words[(offset + i) % words.length]
    input.push(`${word}\n`)
  }
  return input
}

const rndPort = () => Math.floor(Math.random() * 40000 + 10000)

const writeStream = (stream, input, time) => {
  let count = 0
  const iv = setInterval(function () {
    stream.write(input[count].trim() + '\n')

    if (++count === input.length) {
      clearInterval(iv)
      stream.end()
    }
  }, time)
}

const readableStream = () => {
  const stream = new Readable({ objectMode: true })
  stream._read = function () {}
  return stream
}

module.exports = {
  inputFromAliens,
  inputFromWords,
  rndPort,
  writeStream,
  readableStream
}
