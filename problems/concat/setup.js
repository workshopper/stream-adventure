var through = require('through');
var clone = require('clone');
var chunky = require('chunky');
var wrap = require('wordwrap')(30);

module.exports = function () {
    var tr = through();
    var bufs = chunky(createSentence());
    
    var count = 0;
    var iv = setInterval(function () {
        var buf = bufs.pop();
        if (buf === undefined) {
            clearInterval(iv);
            tr.queue(null);
        }
        else tr.queue(buf.toString().split('').reverse().join(''));
    }, 50);
    
    return { args: [], stdin: tr };
};

var format = [
    'Every $noun in the village heard the $adj clamor from the town square.'
    + ' Looking $adv into the distance, Constable Franklin $verb his $adj '
    + 'periscope to locate the $adj source. Unwittingly, a nearby $noun '
    + '$adv $verb high-velocity $adj particles.\n'
];

var words = {
    noun: [
        'cat', 'pebble', 'conifer', 'dingo', 'toaster oven', 'x-ray',
        'microwave', 'isotope'
    ],
    verb: [ 'steered', 'flipped', 'twiddled', 'consumed', 'emitted' ],
    adj: [
        'piercing', 'confusing', 'apt', 'unhelpful', 'radiometric',
        'digital', 'untrustworthy', 'ionizing'
    ],
    adv: [ 'verily', 'yawnily', 'zestily', 'unparadoxically' ]
};

function createSentence () {
    var words_ = clone(words);
    
    var fmt = format[Math.floor(Math.random() * format.length)];
    return wrap(fmt.replace(/\$(\w+)/g, function (_, x) {
        return take(words[x])
    }));
    
    function take (xs) {
        var ix = Math.floor(Math.random() * xs.length);
        return xs.splice(ix, 1)[0];
    }
}
