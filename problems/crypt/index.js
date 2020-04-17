const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exercise')
const words = require('./words.json')

exercise.solution = path.join(__dirname, 'solution.js')

const file = path.join(__dirname, 'finnegans_wake.txt')

exercise.addSetup(function (mode, callback) {
  const pw = words[Math.floor(Math.random() * words.length)]
  const key = crypto.createHash('md5').update(pw).digest('hex')
  const iv = crypto.randomBytes(8).toString('hex')
  this.submissionCipher = crypto.createCipheriv('aes256', key, iv)
  this.solutionCipher = crypto.createCipheriv('aes256', key, iv)

  this.submissionArgs.push(key, iv)
  this.solutionArgs.push(key, iv)

  process.nextTick(callback)
})

exercise.addProcessor(function (mode, callback) {
  fs.createReadStream(file).pipe(this.submissionCipher).pipe(this.submissionChild.stdin)

  if (mode === 'verify') {
    fs.createReadStream(file).pipe(this.solutionCipher).pipe(this.solutionChild.stdin)
  }

  process.nextTick(callback)
})

exercise = comparestdout(exercise)

module.exports = exercise
