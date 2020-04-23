const path = require('path')
const crypto = require('crypto')

const exercise = require('../../lib/cipherExercise')

function phrase () {
  let s = ''
  for (let i = 0; i < 16; i++) {
    s += String.fromCharCode(Math.random() * 26 + 97)
  }
  return s
}

const ciphers = [{
  algorithm: 'aes-192-cbc',
  key: crypto.createHash('md5').update(phrase()).digest('base64'),
  iv: crypto.randomBytes(8).toString('hex')
}]

const { algorithm, key, iv } = ciphers[Math.floor(Math.random() * ciphers.length)]

exercise.inputFilePath = path.join(__dirname, '/secretz.tar.gz')

exercise.cipherArgs = { algorithm, key, iv }
exercise.execArgs = [algorithm, key, iv]

module.exports = exercise
