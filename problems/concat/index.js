const chunky = require('chunky')
const wrap = require('wordwrap')(30)
const exercise = require('../../lib/stdinExercise')

const format = [
  `Every $noun in the village heard the $adj clamor from the town square.
   Looking $adv into the distance, Constable Franklin $verb his $adj
   periscope to locate the $adj source. Unwittingly, a nearby $noun
   $adv $verb high-velocity $adj particles.\n`
]

const words = {
  noun: [
    'cat', 'pebble', 'conifer', 'dingo', 'toaster oven', 'x-ray',
    'microwave', 'isotope'
  ],
  verb: ['steered', 'flipped', 'twiddled', 'consumed', 'emitted'],
  adj: [
    'piercing', 'confusing', 'apt', 'unhelpful', 'radiometric',
    'digital', 'untrustworthy', 'ionizing'
  ],
  adv: ['verily', 'yawnily', 'zestily', 'unparadoxically']
}

function createSentence () {
  const fmt = format[Math.floor(Math.random() * format.length)]
  return wrap(fmt.replace(/\$(\w+)/g, function (_, x) {
    return take(words[x])
  }))

  function take (xs) {
    const ix = Math.floor(Math.random() * xs.length)
    return xs.splice(ix, 1)[0]
  }
}

const input = chunky(createSentence())

exercise.inputStdin = input

module.exports = exercise
