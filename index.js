const path = require('path')
const workshopper = require('workshopper-adventure')
const util = require('workshopper-adventure/util')

const exerciseDir = path.join(__dirname, './problems')
const shop = workshopper({
  name: 'stream-adventure',
  title: 'STREAM ADVENTURE',
  exerciseDir,
  header: require('workshopper-adventure/default/header'),
  footer: require('workshopper-adventure/default/footer'),
  fail: require('workshopper-adventure/default/fail'),
  pass: require('workshopper-adventure/default/pass'),
  appDir: __dirname
})

require('./menu.json').forEach(function (name) {
  const dir = util.dirFromName(exerciseDir, name)
  const exerciseFile = path.join(dir, './index.js')
  shop.add({ name, dir, exerciseFile })
})

module.exports = shop
