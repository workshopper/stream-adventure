var path = require('path')
var adventure = require('workshopper-adventure/adventure')
var shop = adventure({
  name: 'stream-adventure',
  title: 'STREAM ADVENTURE',
  exerciseDir: path.join(__dirname, './problems'),
  header: require('workshopper-adventure/default/header'),
  footer: require('workshopper-adventure/default/footer'),
  fail: require('workshopper-adventure/default/fail'),
  pass: require('workshopper-adventure/default/pass'),
  defaultOutputType: 'md',
  appDir: __dirname
})

require('./menu.json').forEach(function (name) {
  if (/^!/.test(name)) return
  var d = name.toLowerCase().replace(/\W+/g, '_')
  var dir = path.join(__dirname, './problems', d)
  shop.add(name, function () {
    return require(dir)
  })
})
shop.on('fail', function () {
  process.exit(1)
})

module.exports = shop
