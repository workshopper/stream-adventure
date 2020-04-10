const aliens = require('./aliens.json')

const inputFromAliens = () => {
  const input = []
  for (let i = 0; i < 10; i++) {
    const alien = aliens[Math.floor(Math.random() * aliens.length)]
    input.push(`${alien}\n`)
  }
  return input
}

module.exports = {
  inputFromAliens
}
