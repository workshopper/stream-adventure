const zlib = require('zlib')

const comparestdout = require('workshopper-exercise/comparestdout')

let exercise = require('../../lib/exportFnExercise')
const books = require('./books.json')

function shuffle (xs) {
  return xs.sort(cmp)
  function cmp () { return Math.random() > 0.5 ? 1 : -1 }
}

const getInput = () => {
  const genres = books.reduce(function (acc, book) {
    acc[book.genre] = {
      type: 'book',
      name: book.genre,
      books: []
    }
    return acc
  }, {})

  books.forEach(function (book) {
    book.type = 'book'
    genres[book.genre].books.push(book)
  })

  const keys = shuffle(Object.keys(genres))

  const data = keys.reduce(function (acc, key) {
    const g = genres[key]
    acc.push(JSON.stringify({ type: 'genre', name: g.name }))
    return acc.concat(shuffle(g.books).map(function (book) {
      return JSON.stringify({ type: 'book', name: book.name })
    }))
  }, [])
  return data
}

exercise.inputStdin = getInput()
exercise.stdinMessageSeparator = '\n'

exercise.addProcessor(function (mode, callback) {
  this.submissionStdout = this.submissionChild.pipe(zlib.createGunzip())

  if (mode === 'verify') {
    this.solutionStdout = this.submissionChild.pipe(zlib.createGunzip())
  }

  process.nextTick(function () {
    callback(null, true)
  })
})

exercise = comparestdout(exercise)

module.exports = exercise
