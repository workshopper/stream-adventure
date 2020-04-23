const path = require('path')
const crypto = require('crypto')

const exercise = require('../../lib/cipherExercise')
const words = require('../../lib/words.json')

exercise.inputFilePath = path.join(__dirname, '../../lib/finnegans_wake.txt')

const pw = words[Math.floor(Math.random() * words.length)]
const key = crypto.createHash('md5').update(pw).digest('hex')
const iv = crypto.randomBytes(8).toString('hex')

exercise.cipherArgs = { algorithm: 'aes256', key, iv }
exercise.execArgs = [key, iv]

module.exports = exercise
