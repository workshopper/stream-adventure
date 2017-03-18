const workshopper = require('workshopper-adventure')({
  appDir: __dirname,
  languages: ['en'],
  header: require('workshopper-adventure/default/header'),
  footer: require('workshopper-adventure/default/footer'),
  fail: require('workshopper-adventure/default/fail'),
  pass: require('workshopper-adventure/default/pass')
})

workshopper.addAll([
  "BEEP BOOP",
  "MEET PIPE",
  "INPUT OUTPUT",
  "TRANSFORM",
  "LINES",
  "CONCAT",
  "HTTP SERVER",
  "HTTP CLIENT",
  "WEBSOCKETS",
  "HTML STREAM",
  "DUPLEXER",
  "DUPLEXER REDUX",
  "COMBINER",
  "CRYPT",
  "SECRETZ"
])

module.exports = workshopper
